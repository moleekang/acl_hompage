---
name: aiconlab-design
description: Generate well-branded interfaces and assets for AICONLAB (에이아이콘 랩) — a Korean AI lab YouTube + Wiki documenting one person building a 1-person AI-automated company in public. Audience is 20s-late to 40s-early Korean professionals/freelancers/students. Tone is "친근한 동네 형/누나" + Build in Public. Default visual is light paper (#F5F1E8) with Gaegu handwritten display + Gowun Dodum body, sticker accents, mint/electric/sun/hot signal colors. Brand promise — "AI로 기업 하나를 만들어가는, 진짜의 실험실."
user-invocable: true
---

Read `README.md` for the full v2 system, then explore:

- `colors_and_type.css` — drop-in CSS variables (light paper default, dark via `[data-theme="dark"]`). Imports Gaegu + Gowun Dodum + JetBrains Mono from Google Fonts. Sets `word-break: keep-all` globally.
- `assets/` — logo wordmark + mark, sticker SVGs (callout, arrow, circle, stamp), grain texture.
- `ui_kits/website/` — 17-section AICONLAB company-intro page (React + JSX). Read `index.html` and the `*.jsx` components for layout patterns and copy voice.
- `preview/` — small specimen cards demonstrating individual tokens.

## When creating throwaway artifacts (mocks, prototypes, slides)
Copy `colors_and_type.css` and any sticker SVGs into a working folder, then build static HTML. Reference `ui_kits/website/` patterns for hero, values, testimonials, framework callouts.

## When working on production code
Use the CSS variables as design tokens. **Always pair Gaegu (display) with Gowun Dodum (body)** — never use Gaegu for body. Icon set is **Lucide** via CDN.

## Voice rules (never violate)
- 항상 **존댓말**. 반말 금지.
- 시청자는 **여러분**, 자기 호칭은 **우리**. 당신/너 금지.
- 권위적 톤 금지. "~해야 합니다" X / "~해봤어요" O.
- 결과 우선. 카피보다 숫자·스크린샷·로그가 무겁다.
- 제품 UI에 이모지 금지. 썸네일에서는 `★ ⚠ ✓ ●` 도형만.

## Five core values (judge every decision against them)
1. 기여 우선 (1을 주고, N을 받는다)
2. 솔직한 공유 (노하우를 숨기지 않는다)
3. 상호 존중 (권위적·무시 톤 금지)
4. 실행력 (말이 아닌 결과로 증명)
5. 시간 자유 (시간을 돌려준다)

## Anti-patterns (the "fake market")
- 끝까지 안 가본 사람의 말 → ❌
- 도구 카탈로그 → ❌
- 표면 정보 (프롬프트 팁만) → ❌
- "돈을 번다" 마케팅 → ❌ (우리는 "시간을 판다")
- 공포 마케팅 ("AI 모르면 도태됩니다") → ❌

## If the user invokes without guidance
Ask what surface they need (랜딩페이지, logs/ 글, 위키 문서, 썸네일, 슬라이드), gather a few specifics (target segment, key claim, length), then deliver as HTML. Default to **light paper canvas + Gaegu headlines + Gowun Dodum body + sticker accents** — that's the brand's signature.
