# Overview — acl_hompage
> 마지막 업데이트: 2026-05-13

## 프로젝트 목적

AICONLAB 채널·커뮤니티의 공식 홈페이지. "AI로 1인 기업을 만들어가는 라이브 다큐멘터리"의 단일 진입점. 시청자가 가입하고, 운영자가 위키 멤버로 승급하면, 멤버끼리 위키를 함께 쓰고 공유회에 초대된다.

### 정체성 (메인 페이지에 박제됨)
- "AI를 실험하고, 같이 배우고, 함께 즐기는 — AI 문화 커뮤니티"
- 정체성 → 결과물 → 자동화 순서를 절대 바꾸지 않는다 (AICONLAB Way)

## 현재 상태 (2026-05-13)

### 빌드 완료
- **Phase 1 인프라** — Supabase 프로젝트 생성, `.env.local`, `@supabase/ssr` 클라이언트 헬퍼 3종, 루트 middleware, `/login` + `/auth/callback`
- **Phase 2 Admin UI** — 9개 라우트 (대시보드·멤버·위키·이벤트·블로그·제품·설정 + revisions + event detail). Claude Design 시안 그대로 이식. Paper 톤 + Gaegu/Gowun Dodum.
- **Phase 3 멤버 게이트** — `/llm-wiki` 목록·뷰·에디터·이력, `/insights` 목록·상세·RSVP. 게스트는 멤버 신청 안내 화면.
- **DB 스키마 SQL** — `0001_init.sql` (profiles + handle_new_user + is_admin/is_wiki_member + RLS), `0002_wiki_events.sql` (wiki_pages/revisions + events/invitations + posts/products + RLS), `0003_seed.sql` (기존 posts.ts 9개·products 3개·데모 위키 2개)

### 사용자가 직접 해야 할 것 (남은 운영 작업)
1. Supabase SQL Editor에서 `0001 → 0002 → 0003` 순서대로 실행
2. SQL 끝에 적힌 첫 admin 시드 한 줄 실행 (`UPDATE profiles SET role='admin' WHERE email='money300jo@gmail.com'`)
3. Supabase Auth → Providers → Google 활성화 (`docs/SETUP_GOOGLE_OAUTH.md` 가이드)
4. GCP Console OAuth Client에 callback URL 2개 추가
5. `/login`에서 첫 로그인 → 디자인 검증

### 보류 백로그
- 결제 (Stripe/Toss · event_payments 테이블)
- YouTube 통계 자동 갱신 (현재 9,490 / 57K 하드코딩)
- placeholder 라우트 (`/automation`, `/content-automation`, `/journal`, `/projects`, `/resources`, `/tools`) 통폐합·삭제 결정
- wiki/llm-wiki 첨부 이미지 (Supabase Storage 버킷)

### 디자인 시스템
- 메인 사이트와 admin 모두 **paper-first** (#F5F1E8 canvas + 따뜻한 잉크 텍스트)
- 손글씨 Gaegu (display) + 둥근 Gowun Dodum (body) + JetBrains Mono
- mint/electric/sun/hot 시그널, ±1°·±3° 회전 + stamp shadow
- admin은 같은 토큰 + 데이터 밀도 우선 (sticky table header, hairline 카드)
- 모든 admin 클래스는 `.admin-shell` 부모 스코프로 격리해 메인 사이트와 충돌 없음
