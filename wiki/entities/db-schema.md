# DB Schema — Supabase Postgres
> 마지막 업데이트: 2026-05-13

전체 인벤토리. SQL 원본은 `supabase/migrations/000{1,2,3}_*.sql`. 본 페이지는 **요약·인덱스**.

## Tables

### `profiles`  (0001_init.sql)
auth.users 1:1 확장. 멤버십 상태와 역할의 단일 진실.

| 컬럼 | 타입 | 기본값 | 비고 |
|---|---|---|---|
| id | uuid PK | — | FK auth.users(id) ON DELETE CASCADE |
| role | text | `'guest'` | CHECK guest \| member \| admin |
| status | text | `'active'` | CHECK active \| suspended |
| nickname | text | — | handle_new_user 트리거가 name/email-prefix로 자동 채움 |
| avatar_url | text | — | Google 프로필 이미지 |
| role_changed_at, role_changed_by | timestamptz, uuid | — | admin 변경 시 기록 |
| created_at, updated_at | timestamptz | now() | updated_at은 트리거로 갱신 |

### `wiki_pages` + `wiki_revisions`  (0002_wiki_events.sql)
- `wiki_pages` — 현재 상태. soft delete (`deleted_at`).
- `wiki_revisions` — 모든 저장의 스냅샷. INSERT/UPDATE 트리거가 자동 기록. **append-only**.

### `events` + `event_invitations`  (0002_wiki_events.sql)
- `events` — 공유회 메타. status: draft/open/closed/done. `price_cents` 컬럼만 미리 (결제는 Phase 6+).
- `event_invitations` — PK(event_id, user_id). rsvp: pending/going/declined. viewed_at은 멤버가 첫 조회 시 기록.

### `posts`  (0002 + 0003_seed.sql)
PK = slug. `published_at IS NULL` = draft. cat은 자유 text (현재 6 카테고리: dev, retro, insight, ops, tool, brand). 클라이언트의 categories 매핑이 label·색·glow 제공.

### `products`  (0002 + 0003_seed.sql)
PK = slug. status: beta/coming/live/retired. order_idx로 진열 순서. `published=true`인 행만 공개 노출.

## Functions / Triggers

### 권한 헬퍼
- `is_admin()` — `role='admin' AND status='active'` 인 본인 row 존재 여부. **SECURITY DEFINER** 필수.
- `is_wiki_member()` — `role IN ('member','admin') AND status='active'`. **SECURITY DEFINER** 필수.

### 자동화 트리거
- `on_auth_user_created` (auth.users INSERT AFTER) → `handle_new_user()` → profiles INSERT
- `profiles_touch_updated_at`, `wiki_pages_touch_updated_at`, `events_touch_updated_at`, `posts_touch_updated_at`, `products_touch_updated_at` — `touch_updated_at()` 공용
- `wiki_pages_snapshot` (AFTER INSERT/UPDATE) → `snapshot_wiki_revision()` → 본문/제목 변경 시 wiki_revisions INSERT
- `profiles_guard_self_update` (BEFORE UPDATE) → `guard_profile_self_update()` → admin이 아닌 본인이 role/status 변경 시도 RAISE

## RLS Policies (요약)

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | 본인 OR admin | (트리거가 처리) | 본인 (guard 트리거가 컬럼 보호) · admin은 ALL | — |
| wiki_pages | is_wiki_member() | is_wiki_member() | is_wiki_member() | admin |
| wiki_revisions | is_wiki_member() | (트리거만) | — (append-only) | — |
| events | admin OR 본인이 초대됨 | admin | admin | admin |
| event_invitations | 본인 OR admin | admin | 본인(자기 RSVP) · admin(ALL) | admin |
| posts | published_at IS NOT NULL OR admin | admin | admin | admin |
| products | published OR admin | admin | admin | admin |

## 초기 admin 시드 (수동, 1회만)
`0001_init.sql` 끝 주석 참고:
```sql
UPDATE public.profiles
   SET role = 'admin', role_changed_at = now()
 WHERE id = (SELECT id FROM auth.users WHERE email = 'money300jo@gmail.com');
```
이후 다른 admin은 `/admin/members` GUI에서 승급.
