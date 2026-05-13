# Admin UI — 라우트 · 컴포넌트
> 마지막 업데이트: 2026-05-13

`/admin/**` 전체 구조. 디자인 시안은 `docs/design/admin/`. CSS 토큰은 메인 globals.css에 이미 있고, admin 전용 클래스는 `src/app/admin/admin.css`에서 `.admin-shell` 부모 스코프로 격리.

## 라우트

| 라우트 | 파일 | 핵심 위젯 |
|---|---|---|
| `/admin` | `page.tsx` | 4 위젯 (신규가입·승급대기·활성위키·다가오는공유회) + 빠른액션 4 |
| `/admin/members` | `members/page.tsx` | 검색 + 필터칩(5) + 표 + MemberDrawer(역할 이력 timeline) |
| `/admin/wiki` | `wiki/page.tsx` | 탭(active/trash) + 표 + RowMenu(휴지통/복원) |
| `/admin/wiki/[id]/revisions` | `wiki/[id]/revisions/page.tsx` | 좌측 revision 타임라인 + 우측 diff |
| `/admin/events` | `events/page.tsx` | 검색 + 표 + RSVP 진행률 바 |
| `/admin/events/[id]` | `events/[id]/page.tsx` | 메타 + 본문 + RSVP 표 + 초대 관리 (멤버 카드 그리드 다중선택) |
| `/admin/posts` | `posts/page.tsx` | 표 + 인라인 MDX 에디터(좌 textarea, 우 실시간 미리보기) |
| `/admin/products` | `products/page.tsx` | 카드 그리드 (드래그 진열) + add tile |
| `/admin/settings` | `settings/page.tsx` | 사이트 메타 + 운영자 프로필 + admin 권한 부여 |

## Layout 가드
`src/app/admin/layout.tsx` — 모든 admin 진입 시:
1. `NODE_ENV=production`이거나 `NEXT_PUBLIC_ADMIN_PREVIEW_MODE=0` 이면 strict
2. strict 모드: 비로그인 → /login, role!=admin 또는 status!=active → /로
3. dev 기본 (PREVIEW): 가드 우회, mock data로 디자인 검증

## 공통 컴포넌트
- `src/components/admin/icons.tsx` — Icon (Lucide 대신 자체 SVG 22종)
- `src/components/admin/avatar.tsx` — Avatar (이름 해시 → 8색 팔레트)
- `src/components/admin/sparkline.tsx` — Sparkline (대시보드 신규가입 추이)
- `src/components/admin/row-menu.tsx` — RowMenu (popover 액션 드롭다운)
- `src/components/admin/badges.tsx` — RoleBadge, Status, SectionHead

## Admin shell
- `src/app/admin/_components/sidebar.tsx` — `.sb` (244px, sticky). usePathname()으로 active 표시
- `src/app/admin/_components/page-topbar.tsx` — `.topbar` (crumb + h1 + sub + 우측 meta)

## Mock data
`src/lib/admin/mock-data.ts` — 시안의 8 멤버 / 6 위키 / 5 revisions / 3 이벤트 / 5 글 / 3 제품. Supabase 연동 단계에서 점진 대체.

## 디자인 스코프 격리
메인 사이트의 globals.css에는 `.btn`, `.card-paper`, `.grid-2/3/4` 등이 이미 있음. admin은 같은 이름의 클래스를 다른 스타일로 써야 해서, **모든 admin 클래스를 `.admin-shell .X` 부모 셀렉터로 감쌌다**. 한 페이지에 두 시스템이 충돌 없이 공존한다 (`/admin` 진입 시 메인 Header/Footer가 자동 숨겨지지만 CSS는 같은 페이지에 로드되므로).

## TODO (디자인 받았으나 미반영)
- /llm-wiki, /insights의 멤버용 페이지는 admin 디자인 톤을 차용한 최소 골격. 멤버용 자체 디자인이 도착하면 교체.
- placeholder 라우트(`/automation` 등) 통폐합 또는 삭제 결정 필요.
- /log, /products는 아직 정적 TSX. SQL 실행 후 DB fetch로 교체 예정 (현재 seed SQL 준비됨).
