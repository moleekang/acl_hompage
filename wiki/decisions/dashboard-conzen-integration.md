# Dashboard ↔ 콘젠(launcher) 연결 v1
> 마지막 업데이트: 2026-05-19
> 상태: 설계 결정. append-only.

`decisions/dashboard-v1.md`의 콘젠 탭이 어떤 데이터 소스로, 어떤 방식으로 채워질지 확정. 입력은 `concepts/metadata-inventory.md` §1.

## 사실 (조사 결과 — 2026-05-19)

콘젠 = `tubegen-launcher` 모노레포. 제품명 ConGen.

| 구성 | 역할 | 스택 | 위치 |
|---|---|---|---|
| `cloud-server` | 인증·플랜·키 관리·admin | Express + Postgres on Railway + JWT + Google OAuth | Railway |
| `local-server` | 영상 파이프라인 (script/scene/TTS/image/assembly) | Express + SQLite | 사용자 PC |
| `electron-app` | ConGen 데스크톱 UI | Electron | 사용자 PC |

### cloud-server DB (Railway Postgres)

`users` (8컬럼): `id`, `google_id`, `email`, `name`, `profile_image`, `password_hash`, `created_at`, `updated_at`
`api_keys` (8컬럼): `key`, `user_id`, `email`, `plan` (basic/pro), `expires_at`, `is_active`, `created_at`, `last_used_at`, `owner_user_id`

Stripe·기기 바인딩 컬럼은 이미 DROP됨 (`refactor-payment-prompt-restructure` ADR). 결제는 **무통장 입금** 운영.

### 이미 존재하는 admin API

| 메서드 | 경로 | 응답 |
|---|---|---|
| POST | `/admin/login` | admin JWT |
| GET | `/admin/users` | 전체 key 목록 + summary (total/active/inactive) |
| GET | `/admin/user/:key` | 개별 상세 |
| POST | `/admin/user/:key/toggle` | 활성/비활성 |
| POST | `/admin/user/:key/plan` | basic ↔ pro 변경 |

## 결정

### 연결 패턴: **#1 REST API (기존 admin endpoint 재사용)**

- `dashboard-v1.md`의 5개 옵션 중 #1 채택. **새 endpoint 추가 없음.**
- 홈페이지 server-side에서 admin token 들고 `GET /admin/users` 호출 → 응답을 Supabase의 sync 테이블에 적재.
- 직접 DB 연결(#2)을 안 쓰는 이유: cloud-server가 Railway Postgres 외부 접속을 열어줘야 하고, 스키마 변경 시 대시보드 깨짐. API 계약이 더 안전.

### Sync 전략: **일 1회 cron (Stage B)**

- 결제·가입 실시간성 "하루 지연 OK" 결정 (`dashboard-v1.md`).
- Vercel Cron 또는 Supabase pg_cron으로 매일 새벽 03:00 KST.
- 실패 시 자동 재시도 1회, 알림은 v2에서.

### Supabase sync 테이블 (Stage B에서 생성)

```sql
-- 일별 스냅샷. 최신 1행만 의미 있고 과거 행은 추세 분석용.
create table conzen_users_daily (
  snapshot_date     date primary key,
  total_users       integer not null,
  total_keys        integer not null,
  active_keys       integer not null,
  basic_keys        integer not null,
  pro_keys          integer not null,
  new_signups_24h   integer not null,
  pro_upgrades_24h  integer not null,
  fetched_at        timestamptz not null default now()
);

-- 사용자 단위 매핑 (이메일 기준 ↔ 홈페이지 profiles)
create table conzen_users (
  email             text primary key,
  conzen_user_id    integer not null,
  google_id         text,
  plan              text not null,           -- basic/pro
  is_active         boolean not null,
  expires_at        timestamptz,
  conzen_created_at timestamptz not null,
  last_used_at      timestamptz,
  synced_at         timestamptz not null default now()
);
```

email PK로 두면 홈페이지 `profiles.email`과 자연스럽게 join.

### 인증

- 홈페이지 `.env.local`에 `CONZEN_ADMIN_TOKEN` 추가 — cloud-server의 `/admin/login`으로 발급받아 보관
- 토큰 만료되면 cron이 자동 재발급할 수 있도록 admin 계정 credentials도 env에 (server-only)
- 호출은 항상 server-side fetcher에서만 (`src/lib/dashboard/fetchers/conzen.ts`)

### 통합 키

- `email` 단일 키. 콘젠 users.email ↔ 홈페이지 profiles.email.
- google_id도 같이 저장해두지만 매칭 보조용 (홈페이지가 Supabase Auth라 raw google_id 직접 노출 안 됨).

## 한계와 보완 작업

### 1. 영상 생성 통계가 cloud에 없음

`local-server`(사용자 PC SQLite)에 있고 cloud-server로는 안 옴. 콘젠의 **핵심 사용 지표**가 비는 상태.

**옵션 A (권장)**: 일일 비콘 — local-server가 매일 1회 cloud-server에 "오늘 N개 생성, 누적 M개" 전송.
- 콘젠 cloud-server에 `POST /usage/daily-beacon` 신설 1개만 추가
- local-server `cron-or-startup` 트리거로 호출
- 오프라인 사용자는 다음 온라인 시 batch 전송

**옵션 B**: 영상 생성 통계는 v1에서 포기. 대시보드엔 "구현 예정" placeholder만.

→ v1 출시 시점에는 **옵션 B**로 가고, v1.1에서 옵션 A 별도 ADR.

### 2. 결제 데이터는 plan 변경 시점만

무통장 입금이라 자동 결제 이벤트가 없음. 추적 가능한 건:
- `plan` 컬럼이 `basic` → `pro`로 바뀐 시점 (= 입금 확인 후 admin이 수동 변경한 시점)
- `expires_at` 컬럼

**유료 전환율** 정의: `pro로 1번이라도 바뀐 적 있는 사용자 / 전체 가입자`. 정확한 매출은 별도 장부 필요.

→ Sync 시 plan 변경 이력 테이블 `conzen_plan_changes` 추가 (event log):
```sql
create table conzen_plan_changes (
  id serial primary key,
  email text not null,
  from_plan text,
  to_plan text not null,
  detected_at timestamptz not null default now()
);
```
매일 sync 시 직전 스냅샷과 plan 비교해서 변경된 것만 insert.

### 3. 인구통계 (연령·성별·지역) 부재

콘젠 `users` 테이블에 없음. 가입 시 안 받음.

→ **별도 작업 필수**: cloud-server `users` 테이블에 컬럼 추가 + 가입 폼 1~2 문항 추가. 본 ADR 범위 밖, 별도 ADR에서 다룰 것.

## 콘젠 쪽에 필요한 작업 (최소)

홈페이지 대시보드를 위해 콘젠 코드에 손대야 하는 것:

1. **(필수)** admin 계정 1개 발급 + 토큰을 안전하게 홈페이지 env에 전달
2. **(권장)** `GET /admin/stats/summary` 신설 — 현재는 `/admin/users` 전체 받아서 클라이언트에서 집계하지만, 사용자 많아지면 무거움. 서버에서 미리 집계해주는 endpoint 1개.
3. **(v1.1)** 영상 생성 일일 비콘 endpoint
4. **(별도 ADR)** users 인구통계 컬럼 추가

1번만 있으면 v1은 굴러감. 나머지는 점진.

## 구현 순서 (Stage B 시작 시)

1. 콘젠에서 admin 계정 생성 → 토큰 발급 → 홈페이지 env에 저장
2. Supabase에 sync 테이블 3개 마이그레이션 (`0004_conzen_sync.sql`)
3. `src/lib/dashboard/fetchers/conzen.ts` — `/admin/users` 호출 + 집계 + upsert
4. Vercel Cron 등록 (매일 03:00 KST)
5. `/dashboard/conzen` 페이지 — sync 테이블만 읽어서 표시

## 의존성

- `wiki/concepts/metadata-inventory.md` §1 — 콘젠 항목·소스·한계
- `wiki/decisions/dashboard-v1.md` — 전체 대시보드 설계, 5개 옵션 비교
- `tubegen-launcher/wiki/decisions/refactor-payment-prompt-restructure.md` — Stripe 폐기 이력 (참조)
- `tubegen-launcher/wiki/entities/database.md` — 콘젠 Postgres 스키마 (참조)

## 변경 이력

- 2026-05-19 — v1 초안 (#1 REST 채택, 일 1회 cron sync, 3개 sync 테이블, 한계·콘젠 쪽 작업 명시)
