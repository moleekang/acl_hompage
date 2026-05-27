# Launch Prep v1 — 일반 공개 전 4개 선결 작업
> 마지막 업데이트: 2026-05-19
> 상태: 실행 계획. append-only — 변경 시 새 ADR.

콘젠(=tubegen-launcher)을 단톡방 closed beta에서 일반 공개로 가져가기 전에 필요한 4개 작업의 상세 컬럼·체크리스트·근거. 입력은 `concepts/metadata-inventory.md` + ultrathink 회의(2026-05-19, 채팅 로그).

## 작업 4개 요약

1. **회원가입 추가 메타데이터** — 콘젠 cloud-server `users` 테이블 확장 + 가입/온보딩 폼 라디오 문항 추가
2. **콘젠 런처 사용자 로그** — local-server SQLite 이벤트를 cloud-server로 전송, 에러 로그 포함
3. **Windows 코드 서명** — 옵션 3개 비교, 결정 보류 (별도 ADR 예정)
4. **도메인 추가 연결** — 신규 구매부터 시작, 서브도메인 구조 잡기

각 작업은 서로 독립적이라 병렬 진행 가능. 우선순위는 §결정에서 명시.

---

## 1. 회원가입 추가 메타데이터

### 근거

ultrathink 분석에서 도출 — 인구통계·유입 경로·콘텐츠 활동 단계는 **가입 시점에 안 받으면 영영 못 받는** 데이터. closed beta 동안 흘려보내는 가입자 한 명 한 명이 되돌릴 수 없는 정보 손실. ICP 정의·일반 공개 시 타겟팅·카테고리 깊이 결정의 직접 입력.

### 입력 원칙

- **라디오 버튼 only** — 직접 입력 0. 30초 안에 끝나야 함.
- 필수 3문항 + 선택 2문항 = 총 5문항
- 마찰 최소화 — Google OAuth 후 1화면 (skip 가능, 단 별표 표시)

### DB 컬럼 (콘젠 cloud-server `users` 테이블 추가)

```sql
ALTER TABLE users
  ADD COLUMN age_group           TEXT,                    -- '10s','20s','30s','40s','50s+'
  ADD COLUMN content_stage       TEXT,                    -- 'planning','hobby','side','main','pro'
  ADD COLUMN referral_source     TEXT,                    -- 'youtube','kakaotalk','recommendation','search','community','other'
  ADD COLUMN content_categories  TEXT[],                  -- ['economy','travel','psychology',...]
  ADD COLUMN target_frequency    TEXT,                    -- 'weekly_low','weekly_mid','daily','none'
  ADD COLUMN onboarding_completed_at TIMESTAMPTZ;

CREATE INDEX idx_users_age_group       ON users (age_group);
CREATE INDEX idx_users_content_stage   ON users (content_stage);
CREATE INDEX idx_users_referral_source ON users (referral_source);
```

기존 사용자는 모든 컬럼 NULL. 다음 로그인 시 onboarding 모달 1회 노출.

### 폼 항목

**필수 (가입 직후 1화면)**

A. **연령대를 알려주세요** (1개 선택)
- 10대 / 20대 / 30대 / 40대 / 50대 이상

B. **현재 콘텐츠 활동 단계는?** (1개 선택)
- 아직 시작 전 (만들고 싶음)
- 취미로 가끔 만듦
- 부업·사이드프로젝트로 운영 중
- 본업·주 수입원
- 전문 크리에이터·대행사

C. **콘젠을 어디서 알게 되셨어요?** (1개 선택)
- AI Conlab 유튜브
- 카카오톡 단톡방
- 지인 추천
- 검색 (Google·Naver)
- 커뮤니티·SNS
- 기타

**선택 (첫 사용 후 onboarding 2단계)**

D. **주로 만들고 싶은 콘텐츠 카테고리** (다중 선택, 콘젠 14 카테고리에 1:1 매핑)
- 경제·재테크 / 여행 / 심리학 / 역사 / 교육 / (...나머지 9개, 콘젠 카테고리 정의에 따라)

E. **영상 만드는 목표 빈도** (1개 선택)
- 주 1~2개
- 주 3~5개
- 매일 1개 이상
- 정해진 빈도 없음

### UX 흐름

- 신규: Google OAuth → "환영합니다. 더 좋은 경험을 위해 30초만 도와주세요" → A·B·C → 콘젠 앱 진입
- 첫 영상 생성 직후: 작은 토스트로 D·E 노출 (skip 가능)
- 기존 사용자: 다음 로그인 시 모달 1회. 첫 회는 강제, 두 번째부터 skip 가능

### 마이그레이션

- 콘젠 cloud-server `database.ts`의 `runMigrations()`에 `ALTER TABLE` 추가
- 기존 사용자 NULL 허용 (백필 시도 X — 사용자한테 직접 답받는 게 정확)
- 다음 로그인 시 `onboarding_completed_at IS NULL`인 사용자에게 모달

### 작업 체크리스트

- [ ] 콘젠 카테고리 14개 정확한 식별자 확인 (`tubegen-launcher/wiki/concepts/categories-and-styles.md`)
- [ ] `database.ts` 마이그레이션 추가
- [ ] `routes/google-auth.ts` 응답에 `onboarding_required` 플래그 추가
- [ ] electron-app onboarding 화면 1개 (5문항 라디오)
- [ ] 기존 사용자 모달 컴포넌트
- [ ] 단톡방 베타 멤버 1명에게 테스트 빌드
- [ ] 일반 공개 가능 직전에 전 사용자 onboarding 완료율 ≥ 80% 확인

---

## 2. 콘젠 런처 사용자 로그

### 근거

콘젠의 핵심 사용 지표(영상 생성 횟수·카테고리·실패율)가 local-server SQLite에만 있어서 cloud에 안 모임. ultrathink에서 도출 — closed beta에서 가장 중요한 데이터. 안 모으면 "14×19 카테고리×스타일 중 진짜 쓰이는 게 뭔지" 같은 질문에 영영 답 못 함.

### 수집할 이벤트

| event_type | 발생 시점 | 핵심 필드 |
|---|---|---|
| `app_launch` | 앱 실행 시 | app_version, os |
| `video_start` | 사용자가 "영상 생성" 버튼 | category, style, video_length_sec |
| `video_complete` | 모든 단계 성공 | category, style, duration_ms, output_size_bytes |
| `video_fail` | 어느 단계든 실패 | category, style, fail_stage, error_code, error_message |
| `error` | 일반 에러 (네트워크·디스크·기타) | error_code, error_message, stack_trace (truncated) |
| `category_select` | 사용자가 카테고리·스타일 옵션 탐색 (선택, 트래픽 부담 시 제외) | category, style |
| `export_done` | 결과물 저장 완료 | output_format, output_size_bytes |

`fail_stage` 값: `script` / `scene_split` / `tts` / `image_gen` / `video_assembly` / `unknown`

### DB 스키마 (cloud-server Postgres)

```sql
CREATE TABLE usage_events (
  id                BIGSERIAL PRIMARY KEY,
  user_id           INTEGER REFERENCES users(id),
  api_key           TEXT,                          -- 인증 시 받은 키 (감사 용)
  event_type        TEXT NOT NULL,                 -- 위 표
  category          TEXT,                          -- 'economy', 'travel', ...
  style             TEXT,                          -- 'cinematic', 'retro', ...
  video_length_sec  INTEGER,                       -- 사용자가 의도한 영상 길이 옵션
  duration_ms       INTEGER,                       -- 생성에 걸린 시간 (video_complete)
  output_size_bytes BIGINT,                        -- 결과물 크기
  output_format     TEXT,                          -- 'mp4', 'mov', ...
  fail_stage        TEXT,                          -- video_fail/error 시
  error_code        TEXT,                          -- 'NETWORK_TIMEOUT', 'DISK_FULL', ...
  error_message     TEXT,                          -- 최대 1000자, redacted
  stack_trace       TEXT,                          -- 최대 2000자, redacted (error 시만)
  app_version       TEXT NOT NULL,
  os                TEXT NOT NULL,                 -- 'mac','win','linux'
  os_version        TEXT,                          -- '14.5', '11', ...
  occurred_at       TIMESTAMPTZ NOT NULL,          -- 사용자 PC 시각
  received_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_payload       JSONB                          -- 미래 확장용 free-form
);

CREATE INDEX idx_usage_events_user_id    ON usage_events (user_id);
CREATE INDEX idx_usage_events_event_type ON usage_events (event_type);
CREATE INDEX idx_usage_events_occurred_at ON usage_events (occurred_at);
CREATE INDEX idx_usage_events_category   ON usage_events (category) WHERE category IS NOT NULL;
```

### 전송 방식

closed beta 단계엔 **즉시 전송 + 오프라인 큐잉** (real-time observability 우선).

- local-server SQLite에 `usage_event_queue` 테이블 (id, payload JSON, created_at, sent_at)
- 이벤트 발생 → 큐에 insert → 1분마다 flush worker가 batch로 cloud-server에 전송
- 전송 성공 시 `sent_at` 업데이트, 7일 후 자동 삭제
- 오프라인이면 큐에 쌓이고 온라인 복귀 시 자동 flush

일반 공개 후 트래픽 많아지면 day-batch로 전환 (별도 ADR).

### Cloud-server 신규 endpoint

```
POST /usage/events            # 단일 이벤트
POST /usage/events/batch      # 배치 (큐 flush)
```

- 인증: 사용자 API key (`Authorization: Bearer <key>`)
- 페이로드: JSON, 위 스키마 필드들
- 응답: 201 Created + 받은 이벤트 ID
- rate limit: 사용자당 분당 60 (스팸 방지)

### PII·보안 정책

- `email`은 user_id로만 식별. event 레코드에 email 저장 안 함.
- `error_message`·`stack_trace`는 클라이언트에서 redaction 후 전송:
  - 절대 경로 → `<USER_PATH>/...` (홈 디렉터리 마스킹)
  - API key·token 정규식 매치 → `<REDACTED>`
  - 이메일 정규식 매치 → `<REDACTED_EMAIL>`
- 90일 보관 후 집계 테이블로 옮기고 raw 삭제 (별도 cron, v1.1)
- `raw_payload`는 디버깅용. 일반 분석 쿼리는 정형 컬럼만.

### 작업 체크리스트

**Local-server**

- [ ] `usage_event_queue` SQLite 테이블 추가
- [ ] event 발행 헬퍼 `logEvent(event_type, fields)` 추가
- [ ] 영상 파이프라인 각 단계에 `logEvent` 호출 삽입 (start/complete/fail)
- [ ] 글로벌 error handler에서 `logEvent('error', ...)` 호출
- [ ] flush worker (1분 cron) + 오프라인 큐 재시도
- [ ] redaction 유틸 (path·token·email)

**Cloud-server**

- [ ] `usage_events` 테이블 마이그레이션 (`database.ts`)
- [ ] `routes/usage.ts` — POST endpoint 2개
- [ ] 인증 미들웨어 적용 (기존 `auth.ts` 재사용)
- [ ] rate limit (express-rate-limit 또는 단순 in-memory)

**검증**

- [ ] 단톡방 멤버 1명에게 테스트 빌드 → 영상 1개 생성 → cloud에 이벤트 도착 확인
- [ ] 오프라인 시나리오 (Wi-Fi 끄고 영상 1개 → 다시 켜서 큐 flush 확인)
- [ ] redaction 동작 확인 (사용자 경로·키가 마스킹 됐는지)

---

## 3. Windows 코드 서명 (옵션 비교, 결정 보류)

### 근거

현재 ad-hoc 서명만 → SmartScreen "확인되지 않은 게시자" 경고. 단톡방 베타 멤버는 운영자가 직접 우회 안내 가능하지만, 일반 공개 시 가입 funnel 첫 단계에서 80%+ 이탈 예상. macOS는 별도 작업(`mac-adhoc-codesigning.md` 후속).

### 옵션 비교

| 옵션 | 비용 | 발급 기간 | 효과 | 추가 요건 |
|---|---|---|---|---|
| **Azure Trusted Signing** | 월 ~$10 (= 연 ~$120) | 2~3주 (Verified Publisher 검증) | EV 수준 즉시 신뢰 | Microsoft Partner Center 등록, D-U-N-S 번호, 사업자등록증 |
| **OV** (Sectigo/DigiCert) | 연 ~$150~300 | 1~5일 | SmartScreen 평판 누적식 (몇 주~몇 달) | 사업자 신원확인, D-U-N-S 권장 |
| **EV** (Sectigo/SSL.com) | 연 ~$300~600 | 1~2주 | 즉시 SmartScreen 통과 | 사업자 + USB 토큰/HSM 관리 (또는 cloud HSM) |

### 공통 준비물

먼저 결정하기 전에 준비해두면 어느 옵션 가도 빨라짐:

- [ ] D-U-N-S 번호 발급 (Dun & Bradstreet, 무료, 1~5영업일) — 회사명·주소·연락처 입력하면 끝
- [ ] 사업자등록증 스캔 (PDF)
- [ ] 대표자 신분증 스캔
- [ ] 회사 전화번호·이메일 (도메인 이메일 권장, 작업 #4와 연계)
- [ ] electron-builder 설정 검토 (`electron-app/package.json`의 `build.win` 섹션)

### 결정 기준

closed beta 동안엔 현재 ad-hoc로 굴러감 → 결정 시점은 "일반 공개 D-1개월". 그 시점에 cost·일정·예산 보고 옵션 선택.

다만 도메인 이메일·D-U-N-S는 어차피 필요하니 **지금 미리 발급**해두는 게 좋음 (작업 #4와 묶어 처리).

### Apple은?

본 ADR 범위 밖 (Windows 우선 결정). 다만 Apple은 단순 — Developer Program $99/년 + Developer ID 인증서 + notarization. 추후 별도 작업.

### 자동 업데이트

코드 서명 받으면 자동 업데이트(electron-updater)도 같이 도입. 현재 "버전 명시 + 클릭 다운로드" 수동 흐름은 일반 공개엔 불충분. 별도 ADR.

### 작업 체크리스트

- [ ] D-U-N-S 번호 신청 (무료, 1~5일)
- [ ] 사업자등록증·신분증 스캔 준비
- [ ] 단톡방 베타 사용자 OS 분포 확인 (Windows 비율 ≥ 50%면 EV 우선순위 ↑)
- [ ] 일반 공개 D-1개월 시점에 3개 옵션 중 최종 선택
- [ ] 선택 후 별도 ADR (`decisions/windows-code-signing.md`)에 결정 사유·계약·갱신일 박제

---

## 4. 도메인 추가 연결 (구매부터)

### 근거

현재 콘젠 cloud-server는 Railway 기본 URL (`*.up.railway.app` 등) 사용 추정. 홈페이지는 Vercel 기본 도메인 또는 별도. 일반 공개 시 신뢰·브랜드·이메일 일관성을 위해 **자체 도메인 + 서브도메인 구조** 필수. 또한 Windows 코드 서명(D-U-N-S 신청) 시 회사 이메일이 도메인 이메일이면 검증이 매끄러움.

### 도메인명 후보 (검토 필요)

- `aiconlab.com` / `aiconlab.kr` / `aiconlab.co.kr` — 메인 브랜드와 직결
- `congen.kr` 또는 `congen.app` — 콘젠 제품 전용 (AICONLAB과 분리, 추후 별도 브랜드화 가능)
- 둘 다 사는 것도 고려 (`aiconlab.com` = 메인, `congen.app` = 제품 랜딩)

→ **검토 필요**: AICONLAB 브랜드 ↔ 콘젠 제품 브랜드를 한 도메인에 묶을지 분리할지. 일반 공개 후 콘젠 상업화 계획에 따라 결정.

### 등록 업체 선택

| 업체 | 장점 | 단점 |
|---|---|---|
| **Cloudflare Registrar** | 도메인 가격 cost (원가 + 0), 무료 SSL·DNS·DDoS, 한국어 UI 일부 | 등록자 정보 영문, .kr 도메인 미지원 |
| **Gabia** | 국내 표준, .kr·.co.kr 지원, 한국어 지원 | 도메인 가격 비쌈, 부가 서비스 푸시 |
| **Namecheap** | 가격 합리, WhoisGuard 무료, 영문 | .kr 미지원, 한국 사업자 결제 일부 불편 |

→ **권장 조합**: `.com`은 Cloudflare(원가), `.kr`이 필요하면 Gabia. 가능하면 .com 단일로.

### 서브도메인 구조 (권장)

```
aiconlab.com           메인 홈페이지 (Next.js on Vercel)
www.aiconlab.com       메인으로 301 redirect
admin.aiconlab.com     /admin 영역 분리 (선택, 보안)
api.aiconlab.com       콘젠 cloud-server (Railway custom domain)
download.aiconlab.com  콘젠 인스톨러 호스팅 (Railway/CDN/S3)
updates.aiconlab.com   electron-updater feed (Railway)
docs.aiconlab.com      사용 가이드 (선택, 추후)
```

지금 당장 필요한 건 `aiconlab.com` + `api.*` + `download.*` 3개. 나머지는 필요할 때 DNS 레코드 추가만 하면 됨.

### 이메일 설정

- 도메인 이메일 필수 (코드 서명 검증·고객 신뢰)
- 옵션:
  - **Google Workspace** — 사용자당 월 $6~. 가장 표준, 운영 편함.
  - **Naver Works** — 국내 표준, 월 6,000원~
  - **Cloudflare Email Routing** — 무료 (forwarding only, send X). 시작 단계엔 충분
- 최소 운영: `contact@aiconlab.com`, `noreply@aiconlab.com` (시스템 발신), `admin@aiconlab.com`

### DNS·SSL

- DNS는 등록 업체에 묶지 말고 **Cloudflare**로 위임 (성능·보안·관리 분리)
- SSL은 Vercel·Railway·Cloudflare 모두 자동 발급 (Let's Encrypt). 수동 발급 불필요

### 작업 체크리스트

- [ ] AICONLAB ↔ 콘젠 브랜드 분리 여부 결정 (1개 도메인 vs 2개)
- [ ] 도메인명 후보 3~5개 짜고 whois 조회 (사용 가능 확인)
- [ ] 등록 업체 결정 (.com만이면 Cloudflare 권장)
- [ ] 도메인 구매 (보통 연 $10~15)
- [ ] DNS를 Cloudflare로 위임
- [ ] Vercel에 메인 도메인 연결
- [ ] Railway에 api.*·download.*·updates.* custom domain 연결
- [ ] 이메일 서비스 선택 + MX 레코드 추가
- [ ] 기본 이메일 계정 3~5개 생성
- [ ] `noreply@` 발신 테스트 (콘젠 인증 메일 등)

### 도메인 작업이 다른 작업과 묶이는 지점

- **Win 코드 서명(#3)**: D-U-N-S·Verified Publisher 검증 시 도메인 이메일이 매끄러움
- **콘젠 자동 업데이트**: `updates.aiconlab.com` feed URL이 electron-updater 설정에 박힘
- **콘젠 cloud-server URL**: `api.aiconlab.com`으로 옮기면 electron-app·local-server의 cloud-client URL 환경변수 일괄 수정 필요 → 배포 마이그레이션 계획 별도

---

## 결정 사항

### 우선순위

1. **#4 도메인** (다른 3개 작업의 기반) → 먼저 구매·이메일·서브도메인 잡기
2. **#1 회원가입 메타데이터** (시간 가역성 ★★★ — 흘려보내는 가입자 영영 못 되돌림)
3. **#2 사용자 로그** (콘젠 핵심 사용 지표 부재 해결)
4. **#3 Windows 서명** (일반 공개 D-1개월 시점에 옵션 최종 결정)

### 병렬화

- #4 (도메인 구매·DNS) ↔ #1 (DB 마이그레이션) 병렬 가능
- #4 (이메일 설정) → #3 (D-U-N-S·Verified Publisher 신청) 의존
- #2는 독립적, 언제든 시작 가능 (단 #1과 같은 PR에서 충돌 가능 → 순차 권장)

### 범위 명시 — 본 ADR이 안 다루는 것

- **macOS 코드 서명** (Apple Developer + Developer ID + notarization) — 별도 ADR
- **자동 업데이트 (electron-updater)** — Windows 서명 결정 후 별도 ADR
- **결제 자동화 (Toss/Stripe)** — 무통장 입금 폐기 시점에 별도 ADR
- **대시보드 코드 구현** — 본 4개 작업 완료 후 dashboard-v1 Stage A 시작

## 의존성

- `wiki/concepts/metadata-inventory.md` — 채널별 수집 가능 항목 (본 ADR 후 §1 콘젠 한계 업데이트 필요)
- `wiki/decisions/dashboard-v1.md` — 전체 대시보드 설계
- `wiki/decisions/dashboard-conzen-integration.md` — 콘젠 연결 방식
- `tubegen-launcher/wiki/concepts/categories-and-styles.md` — 콘젠 14 카테고리 정확한 식별자
- `tubegen-launcher/wiki/decisions/mac-adhoc-codesigning.md` — Mac 임시 서명 (Apple 정식 서명으로 후속)

## 변경 이력

- 2026-05-19 — v1 초안. 4개 작업 통합 ADR. ultrathink 회의(채팅 로그) 결과 반영.
