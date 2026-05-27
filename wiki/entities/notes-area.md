# Notes 영역 (인사이트)

> 마지막 업데이트: 2026-05-27

`/log`(팀 블로그)과 별개로 운영하는 **개인 인사이트** 영역. posts 영역 구조를 그대로 미러 + 작성자(author) 표시 추가.

## 사용자 노출

- 메뉴 라벨: **인사이트** (HeaderClient nav + admin sidebar 둘 다)
- 공개 URL: `/notes` (목록) · `/notes/[slug]` (상세)
- admin URL: `/admin/notes` · `/admin/notes/new` · `/admin/notes/[slug]`

## DB

테이블 `public.notes` — posts 스키마와 1:1 동형:

| 컬럼 | 타입 | 비고 |
|---|---|---|
| slug | text PK | URL 키 |
| title | text NOT NULL | |
| sub | text | 부제 |
| body_mdx | text NOT NULL DEFAULT '' | 본문 |
| cat | text NOT NULL | 카테고리 (posts와 별개 셋) |
| author_id | uuid FK profiles(id) | 작성자 — 카드/상세에 아바타+닉네임 노출 |
| read_time | text | 예: "6분" |
| published_at | timestamptz | NULL=초안 |
| created_at, updated_at | timestamptz | trigger로 자동 |

인덱스: `published_at DESC NULLS LAST`, `cat`.

RLS:
- SELECT: `published_at IS NOT NULL OR is_admin()`
- ALL: `is_admin()`

## 코드 매핑

| 파일 | 역할 |
|---|---|
| `src/app/notes/notes.ts` | categories 정의 + Note 타입 + `fetchNotes/fetchNote/fetchRelatedNotes` (profile join) |
| `src/app/notes/page.tsx` | 목록 — NoteCard 그리드, 카드에 작성자 표시 |
| `src/app/notes/[slug]/page.tsx` | 상세 — 메타에 작성자 아바타+이름 |
| `src/app/admin/notes/page.tsx` | admin 목록 (table + 발행/삭제) |
| `src/app/admin/notes/new/page.tsx` | 새 글 |
| `src/app/admin/notes/[slug]/page.tsx` | 편집 |
| `src/app/admin/notes/_note-form.tsx` | 작성 폼 (controlled inputs, name 속성 없음 → label 기반 셀렉터 필요) |
| `src/app/admin/notes/_notes-table.tsx` | RowMenu 액션 (편집/발행토글/삭제) |
| `src/app/admin/_actions/notes.ts` | createNote/updateNote/publishNote/deleteNote — requireAdmin + revalidatePath(`/admin/notes`,`/notes`,`/notes/[slug]`) |
| `src/lib/admin/fetchers.ts` | `fetchNotesAdmin()` — profile join 포함 |

## posts와의 차이

- 카드/상세에 **작성자 아바타+닉네임 표시** (posts는 author_id 있지만 UI 미노출)
- categories 셋이 **개인 사색 톤** (사색/도구/운영/기록 등 — posts는 사고방식/자동화/회사/실패담/logs)
- 톤 자체: posts=팀 공식 기록, notes=개인 사색

## 미러 한 이유

posts 페이지가 충분히 안정화돼 있어서 그대로 미러하는 게 가장 빠르고 안전. 미래에 둘이 충분히 갈라지면 분리 리팩토링 검토.
