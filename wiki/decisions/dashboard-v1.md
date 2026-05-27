# Dashboard v1 — 통합 메타데이터 대시보드
> 마지막 업데이트: 2026-05-19
> 상태: 설계 결정. append-only — 변경 시 새 ADR.

AICONLAB 운영 전 채널(콘젠·유튜브·단톡방·홈페이지)의 메타데이터를 한 곳에서 보는 통합 대시보드 v1 설계. 입력 명세는 `concepts/metadata-inventory.md`.

## 결정 사항

### 위치

- **별도 독립 페이지** — `/dashboard` (admin only, role=admin 게이트)
- `/admin/**` 아래 두지 않는 이유: admin은 "운영 액션"(승급·게시·삭제) 중심, dashboard는 "관찰" 중심. 정보 아키텍처를 섞으면 어느 쪽도 깔끔하지 않음.
- 같은 Supabase 인스턴스·같은 Next.js 앱·같은 디자인 토큰 사용. layout만 별도(`/dashboard/layout.tsx`).

### 탭 구조

```
/dashboard
├── /                  Overview   — North star + 4채널 요약 카드
├── /conzen            콘젠       — 가입·활성·유료 funnel
├── /youtube           유튜브     — 영상별 성과·시청자
├── /chat              단톡방     — 멤버·메시지·키워드
├── /homepage          홈페이지   — 회원 funnel·위키·이벤트
└── /cross             교차       — 통합 funnel·코호트·매칭
```

각 탭은 라우트 = 폴더 1개. 서비스 추가 시 폴더 1개 + 사이드바 config 한 줄 추가.

### 확장 패턴 (새 채널/서비스 추가 시)

```ts
// src/app/dashboard/_config/tabs.ts
export const dashboardTabs = [
  { slug: '',         label: 'Overview', icon: '✺' },
  { slug: 'conzen',   label: '콘젠',     icon: '◆' },
  { slug: 'youtube',  label: '유튜브',   icon: '▶' },
  { slug: 'chat',     label: '단톡방',   icon: '✦' },
  { slug: 'homepage', label: '홈페이지', icon: '◉' },
  { slug: 'cross',    label: '교차',     icon: '✕' },
  // 새 채널은 여기에 한 줄 추가
];
```

새 채널 추가 절차:
1. `concepts/metadata-inventory.md`에 채널 섹션 append
2. `src/app/dashboard/<slug>/page.tsx` 생성 (server component, 자체 fetcher 호출)
3. `src/lib/dashboard/fetchers/<slug>.ts` 추가 (Supabase 쿼리 또는 외부 API)
4. tabs.ts에 한 줄 추가
5. Overview 탭의 KPI 카드에 새 채널 요약 1줄 추가 (선택)

### 데이터 파이프라인 단계

3단계로 점진 도입. 각 단계가 끝나야 다음 단계 시작.

**Stage A — 직접 쿼리 (Phase 1)**
- 홈페이지 탭만 우선. Supabase에 이미 있는 `profiles`·`wiki_pages`·`events` 등에 server-side SQL 직접.
- 캐시 없음, 매 요청마다 쿼리. 부담 없음 (admin only · 데이터량 적음).
- **목적**: 대시보드 골격 검증, 디자인 시스템 검증.

**Stage B — 외부 소스 sync (Phase 2)**
- YouTube Data API + Analytics API → 자체 테이블 `youtube_stats_daily` (cron 1회/일)
- 콘젠 백엔드 → `conzen_users`·`conzen_events_daily`·`conzen_payments` (cron 또는 webhook)
- 단톡방 → 운영자가 export 업로드 → 파싱 스크립트 → `chat_stats_weekly`
- 대시보드는 sync된 테이블만 읽음. 외부 API 직접 호출 X (속도·quota·안정성).

**Stage C — 통합 분석 (Phase 3)**
- 통합 user_id 매핑 테이블 `user_identities` (email·youtube_channel_id·chat_nickname·conzen_user_id)
- /cross 탭의 funnel·코호트 분석 활성화
- 머티리얼라이즈 뷰 또는 매일 집계 테이블로 성능 확보

### 우선 구현 KPI (Stage A에서 만들 것)

Overview 탭 카드 5개 + 홈페이지 탭 차트 4개로 v1 출시.

**Overview 카드**
1. 총 회원 수 (롤별 분포: guest / member / admin)
2. 30일 활성 멤버 (MAM 정의: 위키 편집 OR 이벤트 RSVP 한 사람)
3. 다가오는 이벤트 수 + 다음 이벤트 RSVP 현황
4. 위키 30일 편집 수
5. 신규 가입 추이 (지난 30일 일별 막대)

나머지 채널(콘젠·유튜브·단톡방)은 카드에 "Stage B에서 연결됨" placeholder.

**홈페이지 탭 차트**
1. 회원 funnel — 게스트 방문 → 가입 → member 승급 → 활성 (각 단계 수·전환율)
2. 가입 추이 — 일/주/월 토글
3. 위키 활성도 — 30일 활성 편집자 / 최다 편집 페이지 Top 5
4. 이벤트 현황 — 진행 중·예정·완료 + invitation 수락률

### 디자인

- 같은 paper-first 토큰 (#F5F1E8 canvas, Gaegu/Gowun Dodum, mint/electric/sun/hot 시그널)
- admin과 같은 컨벤션: sticky header table, hairline 카드, 데이터 밀도 우선
- `.dashboard-shell` 스코프 클래스로 격리 (admin과 별도)
- 차트는 Recharts (이미 lucide-react·shadcn 깔려있으면 그 라인업)

### 인증·권한

- `/dashboard/**` 전체에 미들웨어 게이트. `role=admin`만 통과.
- v2에서 일부 KPI를 member에게도 공개 가능 (커뮤니티 투명성). 그때 ADR 추가.

### 보류 (Stage B 이후)

- 콘젠 백엔드 접근 방식 — REST? 직접 DB 연결? 별도 readonly 계정?
- 단톡방 export 업로드 UI — 매주 화요일 ritual을 어디에 둘지 (`/dashboard/chat/upload` 후보)
- 알림 — KPI 임계값 넘으면 Slack/메일 자동 전송 (Phase 4+)
- 공개용 status page — 일부 KPI를 메인 사이트에 노출 (구독자 수 같은 것)

## 의존성

- `wiki/concepts/metadata-inventory.md` — 각 채널 수집 가능 항목·소스·한계
- `wiki/entities/db-schema.md` — Supabase 현재 스키마
- `wiki/entities/admin-ui.md` — 디자인 시스템·컴포넌트 재사용

## 변경 이력

- 2026-05-19 — v1 초안 (위치·탭 구조·확장 패턴·3단계 파이프라인·v1 KPI 확정)
