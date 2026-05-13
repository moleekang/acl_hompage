# Architecture v1.1
> 마지막 업데이트: 2026-05-13

확정된 시스템 아키텍처. 변경 시 새 ADR 추가 (이 파일은 append-only).

## 결정 사항

### 백엔드
- **Supabase**: Auth + Postgres + Storage + RLS
- launcher의 Railway PG와는 **별도 인스턴스**. 도메인이 다름 (API 키 발급 vs 콘텐츠·멤버십)
- Google OAuth Client는 launcher와 **재사용 가능** — GCP Console의 redirect URIs에 Supabase callback URL과 acl_hompage callback URL 둘 다 추가

### 권한 모델 (v1.1)
2축 모델:
- `role`: `guest` | `member` | `admin`
- `status`: `active` | `suspended`

가입 흐름:
1. 누구나 Google OAuth로 즉시 가입 (handle_new_user 트리거가 profiles row 자동 생성, role=guest)
2. guest는 공개 콘텐츠만 접근. 위키는 안내 화면.
3. 운영자가 `/admin/members`에서 guest → member 승급
4. member부터 위키 읽기·쓰기 가능. 운영자가 초대한 이벤트만 보임.

### 페이지 분류

| 영역 | 접근 | 데이터 소스 |
|---|---|---|
| `/` `/about` `/community` `/membership` | 공개 | TSX 고정 |
| `/products` | 공개 | DB `products` (published만) |
| `/log` · `/log/[slug]` | 공개 | DB `posts` (published_at IS NOT NULL) |
| `/llm-wiki/**` | active 멤버 | DB `wiki_pages` + `wiki_revisions` |
| `/insights/**` | 초대된 active 멤버 | DB `events` + `event_invitations` |
| `/admin/**` | role=admin만 | DB 전부 |

### 위키 — 자유 협업 + revisions 안전망
- 모든 active 멤버가 읽기·쓰기 가능
- `wiki_pages` UPDATE 시 트리거가 자동으로 `wiki_revisions`에 스냅샷
- `wiki_revisions`는 **append-only** (RLS에 UPDATE/DELETE 정책 없음)
- `deleted_at` soft delete — admin만 복원 가능

### 이벤트 — 운영자 초대 명시제
- `events.RLS.SELECT` = admin OR `event_invitations`에 본인 row 존재
- price_cents 컬럼은 지금 두고 값은 0 — 결제는 Phase 6+ (event_payments 별도 테이블)
- 초대 안 받은 멤버는 `/insights` 빈 상태 화면

### 빌드 단계
- **Phase 1 (완료)**: 인프라 — Supabase 헬퍼·middleware·`/login`·`/auth/callback`
- **Phase 2 (완료)**: Admin UI — 9 라우트 (Claude Design 시안 그대로)
- **Phase 3 (완료)**: 멤버 게이트 — `/llm-wiki/**`, `/insights/**`
- **Phase 5 (완료)**: 정적 데이터 → DB seed (`0003_seed.sql`)
- **Phase 6+ (백로그)**: 결제, YouTube 통계 자동 갱신, placeholder 라우트 정리, Storage 첨부

## v1 → v1.1 변경 이력

v1 초안에서 다음이 바뀌었음:

1. **가입 자유화**: v1의 "신청 승인제(status=pending)"를 폐기. 가입은 자유, 위키 권한만 별도 승급.
   - `profiles.status` = `pending`/`active`/`suspended` → `active`/`suspended` (pending 제거)
   - 대신 `profiles.role` = `member`/`admin` → `guest`/`member`/`admin` (guest 추가)
2. **헬퍼 함수 추가**: `is_wiki_member()` (role IN ('member','admin') AND status='active')
3. **사용자가 launcher 패턴(Express+JWT 직접)을 원했지만 launcher에 Supabase가 없음**을 확인 후 Supabase Auth + RLS로 유지

## 보안 메모
- **`is_admin()` / `is_wiki_member()` 둘 다 SECURITY DEFINER 필수.** 안 그러면 profiles RLS 자기참조 → 무한루프
- service_role 키는 server-only (`SUPABASE_SERVICE_ROLE_KEY`). 클라이언트 컴포넌트에서 import 금지
- `NEXT_PUBLIC_ADMIN_PREVIEW_MODE` — dev에서 디자인 검증용. production에서는 무시됨. NODE_ENV=production일 때 자동 OFF.
