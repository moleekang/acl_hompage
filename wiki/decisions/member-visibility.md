# 멤버 전용 글 (visibility) 모델
> 마지막 업데이트: 2026-06-11

/log(posts) + /notes(notes)에 글 단위 공개 범위를 도입한 결정. (append-only)

## 결정 사항

- **컬럼**: `posts.visibility`, `notes.visibility` — `text not null default 'public'`, CHECK `public | member` (0013_member_visibility.sql)
- **노출 방식 (사용자 결정)**: 비멤버에게 멤버 전용 글은 **목록에 잠금 카드로 노출** (제목·부제·썸네일 공개, 본문만 차단). 완전 숨김이 아님 — 멤버십 가치를 보여주는 티저 역할.
- **멤버 판별 기준**: llm-wiki 게이트와 동일 — `role IN (member, admin) AND status = 'active'` (`src/lib/membership.ts` `getViewerMembership()`)

## 보안 모델 (2중)

1. **RLS**: `posts_public_read` / `notes_public_read` → `published_at IS NOT NULL AND (visibility='public' OR is_wiki_member()) OR is_admin()`.
   anon key로 PostgREST를 직접 쳐도 멤버 전용 row는 비멤버에게 안 보임.
2. **앱 레이어**: 잠금 카드의 메타데이터(제목 등)는 보여줘야 하므로 공개 fetcher(`log/posts.ts`, `notes/notes.ts`)는 **service-role 클라이언트로 조회**하되, 비멤버 뷰어면 `body_mdx`를 서버에서 비우고 `locked=true`로 정규화. 본문은 클라이언트로 전송 자체가 안 됨.

## 게이트 동선

- 목록 카드: `🔒 멤버 전용` 배지 (log/notes 동일 스타일)
- 상세 페이지: Hero(제목·메타)는 보여주고 본문 자리에 `MemberGate` (`src/components/aiconlab/member-gate.tsx`)
  - 비로그인 → `/login?next={글경로}` / 로그인 guest → 멤버 신청 mailto
- notes `newtab` 모드: 잠긴 글은 raw 새탭 대신 상세(게이트)로 링크, `/notes/[slug]/raw`도 locked면 상세로 redirect

## admin

- posts/notes 폼에 "공개 범위" select (전체 공개 / 🔒 멤버 전용), 테이블 제목 옆 배지
