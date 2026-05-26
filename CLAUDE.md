# acl_hompage

@~/.claude/wiki.md

## Wiki 위치
- 로컬: ./wiki/        ← 작업용 living document

세션 시작 시 로컬 `wiki/index.md` + `wiki/log.md` 마지막 3개 항목 확인.
대화 중 새 정보는 로컬 wiki에 자동 반영.
글로벌 wiki 경로는 `CLAUDE.local.md`(개인) 참조 — vault 경로가 사용자마다 다름.

---

## Git 계정 가드 (필수)

이 repo는 **`moleekang`** GitHub 계정으로만 push 가능.
gh CLI에 여러 계정(`wonsaeng017-cyber`, `cadenlee-ctrl`, `moleekang`)이 등록돼 있고
기본 활성이 `moleekang`이 아닐 수 있음 → 다른 계정으로 push 시 403.

**모든 commit/push 직전 실행:**
```bash
gh auth status | grep -A1 "moleekang" | grep -q "Active account: true" \
  || gh auth switch -u moleekang
```
스위치 후 `git push` 진행. 매번 확인 후 진행할 것.

---

@AGENTS.md
