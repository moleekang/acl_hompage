# Log — acl_hompage
> append-only. 기존 항목은 절대 수정하지 않는다.

---

## [2026-05-13] update | wiki 초기 구조 생성
- index.md, overview.md, log.md 초기화
- decisions/, entities/, concepts/, sources/ 디렉토리 생성
- 프로젝트 CLAUDE.md에 `@~/.claude/wiki.md` import + 로컬 경로 박제

## [2026-05-13] decision | architecture v1 → v1.1 확정
- 백엔드 = Supabase (Auth + Postgres + Storage + RLS)
- 권한 모델 (v1.1): role(guest/member/admin) × status(active/suspended). 가입은 자유, 위키 권한은 운영자 별도 승급.
- 위키 = active member 자유 협업 + revisions 안전망
- 공유회 = 운영자 초대 명시제. 결제는 Phase 6+ (price_cents 컬럼만 미리)
- launcher와는 별도 Supabase 인스턴스. Google OAuth Client는 재사용 가능
- 상세: `decisions/architecture-v1.md`

## [2026-05-13] ingest | admin UI 디자인 시스템
- Claude Design에서 admin 시안 도착 (docs/design/admin/)
- 토큰·atoms·6 화면 (Dashboard, Members, Wiki+Revisions, Events+Detail, Posts, Products, Settings)
- 모두 paper-first + Gaegu/Gowun Dodum. globals.css에 이미 토큰 있음 → admin.css는 추가 클래스만 (.admin-shell 스코프)

## [2026-05-14] update | Mock 폐기 + Supabase fetch + CRUD Server Actions
- `src/lib/admin/mock-data.ts` 삭제, `fetchers.ts` 신설 (service_role admin client로 RLS 우회)
- 9개 admin 라우트 모두 `createAdminClient()` 기반 server component fetch로 전환
- CRUD server actions: `_actions/{members,wiki,events,posts,products}.ts` (revalidatePath 동반)
- 새 admin 라우트: `/admin/posts/new`, `/admin/posts/[slug]`, `/admin/products/new`, `/admin/products/[slug]`
- `0003_seed.sql` 갱신 — admin 시안 mock 데이터(7 dummy users + 6 wiki + 3 events + 6 invitations + 5 posts + 3 products)와 1:1로 시드. auth.users INSERT 패턴 포함.
- production build 통과 + dev 15 라우트 200 검증.

## [2026-05-13] update | Phase 1·2·3 빌드 완료
- Supabase 클라이언트 헬퍼 3종 + middleware + /auth/callback + /login
- DB 스키마 3개 마이그레이션 (0001 init / 0002 wiki·events / 0003 seed)
- Admin 9 라우트 전부 컴파일 통과 (200)
- 멤버 게이트 /llm-wiki (목록·뷰·에디터·이력) + /insights (목록·상세·RSVP) 전부 컴파일 통과
- Header/Footer는 /admin 영역에서 자동 숨김 (usePathname guard)
- /api/test-supabase 임시 연결 테스트 라우트 사용 후 삭제
- 사용자 검증을 위한 NEXT_PUBLIC_ADMIN_PREVIEW_MODE 토글 (dev 기본 ON, prod 강제 OFF)
