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

## [2026-05-27] decision | security hardening + git history rewrite
- Critical 3건 처리:
  - C1: supabase/migrations 평문 비번 노출 → `git filter-repo`로 전 history에서 SQL + .env.local 제거 + force-push (origin/main: ba19f1f → def5c92). supabase/migrations 디렉토리는 .gitignore 추가 (개인 운영).
  - C2: `NEXT_PUBLIC_ADMIN_PREVIEW_MODE !== "0"` (opt-out, 클라이언트 노출) → `process.env.ADMIN_PREVIEW_MODE === "1"` (opt-in, 서버 전용)으로 전환. admin/insights/llm-wiki 3개 layout 모두.
  - C3: `content.ts` 4개 진입점에 `assertAllowedTable()` 런타임 allowlist 추가 (Server Action HTTP endpoint 임의 테이블명 주입 차단).
- 잔여 처리(사용자 hands-on 필요): 운영 admin 비번 회전, Supabase service_role key 회전. rewrite로 노출 확산은 차단했으나 GitHub 캐시/포크엔 남음.
- CLAUDE.md에 gh 계정 가드 추가: 매 push 전 `gh auth status` → moleekang active 확인 (다른 계정 활성 시 force-push 403).

## [2026-05-27] update | E2E (Playwright) 인프라 도입
- 9 시나리오 통과 (admin-content 4 + admin-full 5):
  - 4 콘텐츠 테이블(testimonials/journal_entries/site_tools/site_resources): 생성 → 발행 → 공개 노출(/community,/journal,/tools,/resources) → 수정 → 삭제
  - admin posts/products/wiki: 등록 → 목록 노출 / events·members: read-only 진입
- 안전 가드: `[E2E-TEST-{ts}]` prefix + `published=false` 기본 + `afterAll` cleanup으로 운영 DB 영향 최소화
- 자격증명: 비번은 `.env.local`의 `E2E_ADMIN_USER` / `E2E_ADMIN_PASSWORD`에서 로드 (helpers.ts 비번 평문 박지 않음)
- playwright.config.ts에서 `.env.local` 직접 파싱 (Next dev 서버 의존 X, baseURL=3000, workers=1)

## [2026-05-27] update | notes(인사이트) 영역 신규 추가
- 메뉴 라벨 "인사이트", URL `/notes`, 테이블 `notes` (posts 스키마 미러 + author profile join)
- 공개: `/notes` 목록 + `/notes/[slug]` 상세 — 카드/상세에 작성자 아바타+닉네임 표시
- admin: `/admin/notes` CRUD (page/new/[slug]/_note-form/_notes-table) + `_actions/notes.ts` (create/update/publish/delete + requireAdmin)
- nav(HeaderClient) + admin sidebar에 메뉴 추가
- categories: posts와 별개 (사색/도구/운영/기록 정도 — 개인 인사이트 톤)
- 마이그레이션: 0010_notes.sql (gitignored, 사용자가 Supabase 대시보드 SQL editor에서 적용 완료)
- 의도: /log는 팀 공식 기록, /notes는 개인 사색 — 작성자는 동일 admin이나 분위기 분리

## [2026-05-27] fix | 데이터 mojibake 복구 (인코딩 사고)
- 손상 범위: testimonials 3행, site_tools 5행, journal_entries 1행 모두 깨짐 (site_resources/posts/products/wiki_pages/events는 정상)
- 원인: 0009_content_tables.sql 적용 시 client_encoding 미스매치로 UTF-8 한글 바이트가 CP949로 잘못 해석된 뒤 다시 UTF-8로 저장. `�`(replacement char) 다수라 자동 복원 불가능.
- 복구: 시드 sql의 정상 한글 값을 service_role REST API로 PATCH 덮어쓰기 (testimonials는 order_idx로, site_tools는 slug로 매핑)
- 재발 방지: 향후 마이그레이션은 psql CLI보다 Supabase 대시보드 SQL editor에서 적용 (UTF-8 강제)

## [2026-05-27] decision | aicon.lol 도메인 연결 (Vercel)
- 도메인 등록처: name.com (Railway에서 구매했지만 backend는 name.com nameserver)
- Vercel 프로젝트 `acl_hompage`에 apex + www 둘 다 등록 (vercel domains add)
- name.com DNS에 A 레코드 2개 추가: `@ → 76.76.21.21`, `www → 76.76.21.21` (둘 다 A로 통일, CNAME 대신)
- nameserver는 name.com에 유지 (Vercel로 옮기지 않음)
- SSL 인증서: `vercel certs issue aicon.lol www.aicon.lol` 수동 트리거로 6초 만에 발급
- 검증: https://aicon.lol + https://www.aicon.lol 둘 다 HTTP/2 200 OK
- 추가 작업 가능: www → apex 자동 redirect (Vercel 대시보드에서 한 줄로 설정)

## [2026-05-31] update | 슬러그 자동 생성 + posts 카테고리 정렬
- 문제: admin 에서 슬러그를 수동 입력 → 운영자가 영문 슬러그를 매번 지어내며 헷갈림, 기존 URL 도 파악 어려움
- 해결: `nextSlug(table, prefix)` 서버 헬퍼(`_actions/_slug.ts`)로 `{카테고리}-{순번}` 자동 부여
  - posts=cat(영문), notes=cat(영문 key), products=고정 `p`
  - new 폼: 슬러그 입력란 제거 + 자동생성 안내 / edit 폼: 읽기전용 표시(URL 확인용)
- 부수: posts 폼 카테고리(한글 5종)가 DB·공개 영문 6종(brand/dev/insight/ops/retro/tool)과 불일치 → DB 영문값으로 통일(value=영문, label=한글). 사용자 결정.
- 검증: tsc 통과, 변경 파일 lint 무에러, 기존 DB 슬러그(`record` 의 `1/2/11`, products `pw-prod-*`)와 충돌 없음 확인
- 상세: concepts/slug-rules.md

