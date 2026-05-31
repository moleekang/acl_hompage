# 슬러그(URL) 자동 생성 규칙
> 마지막 업데이트: 2026-05-31

admin에서 글/제품 작성 시 슬러그(URL 마지막 경로)를 **수동 입력하지 않고 서버가 자동 부여**한다.
운영자가 매번 영문 슬러그를 지어내며 헷갈리던 문제를 제거하기 위함.

## 규칙: `{카테고리}-{순번}`
- 카테고리별 누적 번호. 같은 prefix 의 기존 슬러그 중 **최대 번호 + 1**.
- 삭제로 생긴 빈 번호는 재사용하지 않는다(과거 URL 충돌 방지).
- 구현: `src/app/admin/_actions/_slug.ts` 의 `nextSlug(table, prefix)`.

| 영역 | prefix 기준 | 예시 |
|---|---|---|
| posts | `cat` (영문값 그대로) | `insight-1`, `dev-3`, `tool-2` |
| notes | `cat` (영문 key 그대로) | `record-1`, `thought-12` |
| products | 고정 `"p"` | `p-1`, `p-2` |

## 폼 동작
- `new` 모드: 슬러그 입력란을 없애고 "저장 시 자동 생성" 안내만 표시.
- `edit` 모드: 확정된 슬러그를 읽기전용으로 표시(URL 확인용). 슬러그는 생성 후 변경 불가.

## posts 카테고리 = 영문 value + 한글 label
기존에 posts 폼 select 는 한글 5종(사고방식/자동화/회사/실패담/logs)이었으나
**실제 DB `posts.cat` 과 공개 `/log` 페이지는 영문 6종**(brand/dev/insight/ops/retro/tool)을 사용 → 불일치.
2026-05-31 에 **DB 영문값으로 통일**(value=영문, 화면 label=한글)하여 admin·DB·공개 페이지를 정렬.
- label 정의는 공개 `src/app/log/posts.ts` 의 `categories` 가 단일 진실원(admin 은 이를 복제).
- 부수 효과: 과거 admin 이 한글 cat 을 저장하면 공개 페이지에서 전부 `dev` 로 fallback 되던 잠재 버그 해소.

## 기존 데이터 영향
- notes `record` 의 과거 수동 슬러그(`1`,`2`,`11`,`prompt48`)는 `^record-\d+$` 에 안 걸려 무시 → 새 글은 `record-1` 부터 안전.
- products `pw-prod-...`(E2E 잔재), `congen` 등 자유 슬러그는 `^p-\d+$` 에 안 걸려 공존.
