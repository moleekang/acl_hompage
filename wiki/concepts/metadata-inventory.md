# Metadata Inventory v1
> 마지막 업데이트: 2026-05-19
> 상태: 살아있는 문서. 서비스/채널이 추가될 때마다 섹션 추가.

AICONLAB이 운영하는 4개 채널에서 **무엇을 수집할 수 있고, 어떻게 수집하며, 어디에 쓰는가**를 매트릭스로 정리한 인벤토리. 대시보드 v1 (`decisions/dashboard-v1.md`)의 입력 명세.

## 채널 맵

| 채널 | 종류 | 우리 통제권 | 데이터 접근성 |
|---|---|---|---|
| 콘젠 | 영상 자동화 데스크톱 앱 (자체 제품) | 100% | ★★★ (DB 직접) |
| AI Conlab | 유튜브 채널 | 콘텐츠만 | ★★☆ (YouTube API) |
| 단톡방 | 카카오톡 오픈채팅 | 운영자 | ★☆☆ (수동/export) |
| 홈페이지 | Next.js + Supabase (현재 프로젝트) | 100% | ★★★ (DB 직접) |

수집 난이도가 채널마다 한 차수씩 다름 → 대시보드 탭도 **자동화 수준이 다르다는 가정**으로 설계해야 함.

---

## 1. 콘젠 (= tubegen-launcher / ConGen 데스크톱)

> 실측 (2026-05-19) — `tubegen-launcher` repo 직접 확인.
> 모노레포: `cloud-server`(Express+Postgres on Railway) + `local-server`(Express+SQLite, 사용자 PC) + `electron-app`(Electron).
> **연결 방식 결정**: `decisions/dashboard-conzen-integration.md` 참조 — REST API 재사용 + 일 1회 sync.

### cloud-server에 실제 있는 데이터 (= 자동 수집 가능)

| 테이블 | 컬럼 | 활용 |
|---|---|---|
| `users` | id, google_id, email, name, profile_image, password_hash, created_at, updated_at | 가입자 수 / 가입 추세 / Google vs 이메일 비율 |
| `api_keys` | key, user_id, email, **plan**(basic/pro), expires_at, is_active, created_at, last_used_at, owner_user_id | 활성 사용자 / 유료 비율 / pro 만료 임박 |

### cloud-server에 **없는** 데이터 (현재 또는 launch-prep 후)

| 항목 | 현재 상태 | 보완 방법 |
|---|---|---|
| 영상 생성 횟수·카테고리·렌더 통계 | local-server SQLite(사용자 PC)에만 존재 | **launch-prep #2** — `usage_events` 테이블 + local→cloud 즉시 전송 + 오프라인 큐 |
| 결제 금액·시점 | Stripe 폐기, 무통장 입금 운영. plan 변경 시점만 추적 가능 | `conzen_plan_changes` event log로 plan 전이만 수집. 정확 매출은 별도 장부 |
| 연령·콘텐츠 활동 단계·유입 경로·관심 카테고리·목표 빈도 | users 테이블에 컬럼 없음 | **launch-prep #1** — users 5컬럼 추가 + 라디오 5문항 가입/온보딩 |
| 일반 에러·크래시 | 미수집 | **launch-prep #2** — `usage_events`에 `error` event_type 포함 (redaction 적용) |
| OS·앱 버전 | 가입 시 미수집 | **launch-prep #2** — 모든 usage_events에 `os`·`app_version` 필수 |
| 세션 길이·funnel·리텐션 | analytics 도구 미설치 | v1에선 가입일·last_used_at 만으로 근사. PostHog 도입 결정 별도 |

→ launch-prep v1 (`decisions/launch-prep-v1.md`) 완료 후 본 표의 상위 4행이 "수집 가능"으로 이동.

### 데이터 소스 (확정)

- **콘젠 cloud-server `/admin/*` REST API** — 이미 존재하는 endpoint 재사용
  - `GET /admin/users` — 전체 키 목록 + summary(total/active/inactive)
  - `GET /admin/user/:key` — 개별 상세
  - 인증: admin 토큰 (홈페이지 server-only env)
- **Railway Postgres 직접 접속 안 함** — API 계약으로만 통신
- **local-server**: v1 범위 밖 (옵션 A 채택 시 v1.1에서 연결)

### v1에서 만들 KPI

1. 총 가입자 수 (`users` count)
2. 활성 키 수 / 비활성 키 수 (`api_keys.is_active`)
3. basic vs pro 비율 (`api_keys.plan`)
4. **유료 전환율** = "plan='pro'를 1번이라도 가진 적 있는 user / 전체 user"
5. 신규 가입 24h·7d·30d (`users.created_at`)
6. pro 만료 임박 (`api_keys.expires_at` < now + 7d)
7. 미사용 사용자 = 가입 후 30일 동안 `last_used_at` 변화 없음

### v1에서 못 만드는 KPI (한계)

- 영상 생성 funnel — 가입 → 첫 영상 → 5번째 영상 (local 데이터 필요)
- Aha moment 분석 (행동 데이터 부재)
- 연령대 × 유료 전환율 (인구통계 컬럼 없음) ← **사용자가 처음 물어본 그것**. 가입 폼 작업 우선순위 ★★★

### 한계·주의 (요약)

- 데스크톱 + 무통장 입금 모델 특성상 cloud-server는 "발급된 키가 어떤 상태인지"만 안다. 사용 행동은 local에 있음.
- 인구통계는 **가입 시 안 받으면 영영 못 받음**. 가장 빠른 시일 내 가입 폼 마이그레이션 권장.
- PII는 sync 시 익명화 집계만 dashboard에 노출, 원본 email은 별도 테이블에 격리.

---

## 2. AI Conlab 유튜브 채널

### 수집 가능 항목

| 카테고리 | 항목 | 활용 |
|---|---|---|
| 채널 | 구독자 수, 총 조회수, 영상 수, 채널 평점 | 성장 추세 |
| 영상별 | 조회수, 좋아요/싫어요(API에선 likes만), 댓글 수, 평균 시청 시간, 시청 유지율 곡선 | 콘텐츠 성과 비교 |
| 시청자 | 트래픽 소스(검색·추천·외부), 디바이스, 지역, 연령·성별 분포 | 시청자 페르소나 |
| 댓글 | 텍스트, 작성자, 좋아요 수, 답글 수 | 키워드·감성 분석, 다음 영상 주제 |
| 유입 | UTM 붙은 설명란 링크 클릭 → 홈페이지 가입 | 유튜브→홈페이지 전환율 |

### 데이터 소스

- **YouTube Data API v3** — 채널·영상·댓글 메타 (무료, quota 10,000/일)
- **YouTube Analytics API** — 시청자 인구통계·트래픽 소스 (OAuth 필요, 채널 소유자만)
- 자체 백엔드 — 영상 설명란 UTM 링크 클릭 후 가입 추적

### 핵심 활용

1. **영상별 ROI** — 제작 시간 대비 조회수·구독자 전환·홈페이지 가입 수
2. **시청 유지율 곡선** — 어느 구간에서 빠지는지 → 다음 영상 편집 룰
3. **댓글 키워드 트렌드** — 시청자가 원하는 다음 주제
4. **유튜브 시청자 ↔ 홈페이지 가입자 인구통계 갭** — 누구를 잃고 있는가

### 한계·주의

- YouTube Analytics API는 **채널 소유자 OAuth 필수**. 자동화하려면 refresh token을 안전한 곳에 보관.
- 댓글은 quota 비쌈 → 매일 전체 재수집 X, 신규만 incremental.
- 현재 상태: 9,490/57K **하드코딩**(`wiki/overview.md` 백로그). 자동 갱신이 첫 작업.

---

## 3. 단톡방 (카카오톡 오픈채팅)

### 수집 가능 항목

| 카테고리 | 항목 | 수집 방식 |
|---|---|---|
| 멤버 | 총 멤버 수, 일별 입장/퇴장 | 운영자 수동 기록 (주 1회) |
| 메시지 | 일별 메시지 수, 활발한 시간대 | export 파일 파싱 |
| 활동 멤버 | 발화한 닉네임 수, 발화 분포 (상위 N명) | export 파일 파싱 |
| 키워드 | 단어 빈도, n-gram, 시간별 토픽 변화 | export 파일 + 형태소 분석 |
| 이벤트 | 공지·공유회 안내에 대한 반응(이모지·답글 수) | 수동 캡처 |

### 데이터 소스

- **공식 API 없음** — 카카오는 오픈채팅 API 미제공
- **카톡 export** (PC/모바일에서 .txt) — 주 1회 수동 export → 파싱 스크립트
- **운영자 수동 기록** — 멤버 수만 매주 화요일 같은 시간

### 핵심 활용

1. **커뮤니티 활성도 지표** — 메시지 수 7일 이동평균, 활성 멤버 비율(말한 사람/총원)
2. **시간대별 활성도** — 공지·공유회 안내 최적 시각
3. **키워드 트렌드** — 콘젠/유튜브 영상 주제 발굴
4. **인구통계는 없음** — 닉네임만 추적, 실명·연령 매칭 불가
   → **보완**: 공유회 RSVP 폼·홈페이지 가입 시 "단톡방 닉네임" 자기 신고 필드 추가하면 cross-channel 매칭 가능

### 한계·주의

- 카톡 export는 **PII 위험**. 분석 후 원본 파일은 별도 암호화 보관.
- 수동 작업 → 자동화 불가. 주 1회 ritual로 굳히는 게 현실적.
- 닉네임 변경 자유 → 동일인 식별 어려움. 자기신고 매칭이 유일한 cross-channel 키.

---

## 4. 홈페이지 (Next.js + Supabase, 현재 프로젝트)

### 수집 가능 항목

| 카테고리 | 항목 | 데이터 소스 |
|---|---|---|
| 회원 | 가입자 수, role(guest/member/admin), status, 가입일, 가입 경로 | `profiles` 테이블 |
| 트래픽 | 라우트별 PV/UV, 평균 체류, 직행 vs 유입, 리퍼러 | Vercel Analytics |
| 위키 활동 | 페이지 수, 편집 수, 활성 편집자, 가장 많이 본 페이지 | `wiki_pages` + `wiki_revisions` |
| 이벤트 | 이벤트 수, RSVP 수, 참석률, invitation 발급/수락률 | `events` + `event_invitations` |
| 콘텐츠 | 블로그 글 수, 제품 페이지 조회 | `posts` + `products` + analytics |
| Funnel | 비로그인 방문 → 가입 → member 승급 → 첫 위키 편집·첫 RSVP | 자체 쿼리 (위 테이블 join) |

### 데이터 소스

- **Supabase Postgres** — 회원·위키·이벤트·콘텐츠 (직접 SQL)
- **Vercel Analytics** — 트래픽 (이미 통합되어 있을 가능성 높음, 확인 필요)
- **Plausible / GA4** (선택) — 더 세밀한 행동·UTM 추적
- **자체 이벤트 테이블** (선택) — `events_log` 만들어 핵심 클릭 기록

### 핵심 활용

1. **회원 funnel** — 게스트 → 가입 → member 승급 → 활성 멤버. 각 단계 전환율과 평균 소요일.
2. **위키 활성도** — 최근 30일 편집자 수 (커뮤니티 건강도)
3. **공유회 참석률** — invitation 수락률 × 실제 참석률
4. **유튜브→홈페이지 전환** — UTM source=youtube 가입자 수 / 기간 영상 조회수

### 한계·주의

- 트래픽 수집 도구 결정 필요 (Vercel Analytics만 vs Plausible 추가).
- `events_log` 테이블 없이는 클릭·스크롤 등 미세 행동 추적 불가. 우선은 페이지뷰만으로 충분.

---

## Cross-channel 통합

### 통합 키

| 키 | 신뢰도 | 적용 가능 채널 |
|---|---|---|
| 이메일 | ★★★ | 콘젠 ↔ 홈페이지 |
| Google OAuth sub | ★★★ | 콘젠 ↔ 홈페이지 (둘 다 Google 인증 쓰면) |
| 단톡방 닉네임 (자기신고) | ★☆☆ | 단톡방 ↔ 홈페이지 |
| UTM source | ★★☆ | 유튜브·외부 → 홈페이지·콘젠 |

### Cross 활용

1. **유튜브 → 홈페이지 → 콘젠 funnel** — 영상 시청 → UTM 가입 → 콘젠 회원가입 → 유료 전환
2. **공유회 참석 ↔ 콘젠 유료 전환율** — 커뮤니티 참여가 유료 전환에 미치는 영향
3. **단톡방 활성 멤버 ↔ 홈페이지 위키 편집자 교집합** — 진짜 코어 멤버 식별

### North star metric 후보 (대시보드 Overview 탭에 들어갈 것)

| 후보 | 측정 빈도 | 우선순위 |
|---|---|---|
| 월간 활성 멤버 (MAM) — 위키 편집·이벤트 RSVP·콘젠 사용 중 1개 이상 | 월 1회 자동 | ★★★ |
| 콘젠 유료 전환율 (가입 후 30일 내 결제) | 주 1회 자동 | ★★★ |
| 유튜브→홈페이지 가입 전환율 (UTM 기반) | 주 1회 자동 | ★★☆ |
| 공유회 참석률 (참석/초대) | 이벤트 종료 시 | ★★☆ |
| 위키 30일 활성 편집자 수 | 주 1회 자동 | ★☆☆ |

---

## 다음 작업

1. 대시보드 v1 설계 — `decisions/dashboard-v1.md` (이 인벤토리를 입력으로)
2. 각 채널 첫 수집 스크립트 — Supabase 쿼리 1개씩 + YouTube API 1개부터 (콘젠은 자체 백엔드 접근법 확정 후)
3. 단톡방 export 파싱 스크립트 — Python, 매주 화요일 실행

## 변경 이력

- 2026-05-19 — 초안 (4채널 × 매트릭스 + cross + north star 후보)
- 2026-05-19 — §1 콘젠 섹션을 실측(tubegen-launcher repo 조사)으로 교체. cloud-server 실제 스키마, 자동수집 가능/불가능 항목, v1 KPI/한계 명확화. 연결 방식은 `decisions/dashboard-conzen-integration.md`로 분리.
- 2026-05-19 — §1 "없는 데이터" 표를 launch-prep v1 작업 매핑으로 갱신. 인구통계·사용 로그·에러·OS/버전은 `decisions/launch-prep-v1.md` 완료 시 자동수집 가능 영역으로 이동.
