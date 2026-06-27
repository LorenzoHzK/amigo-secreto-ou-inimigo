---
trigger: always_on
---

# 03 - GIT & COMMIT CONVENTIONS

## Mandatory: One Commit Per Sprint Task

At the end of EVERY sprint task, generate exactly ONE atomic git commit containing all changes from that task. Do not commit partial work or bundle multiple tasks into one commit.

## Commit Format

```
<type>(<scope>): <imperative description under 72 chars>

[optional body — only when the WHY is not obvious from the title]
```

## Allowed Types

| Type | Use when |
|------|----------|
| `feat` | New file, feature, or behavior that did not exist before |
| `fix` | Corrects wrong behavior, broken logic, or a bug |
| `refactor` | Rewrites code without changing external behavior |
| `chore` | Configuration, scaffolding, scripts, dependencies |
| `docs` | Documentation files only (.md, comments) |
| `test` | Creating or updating test files |
| `perf` | Performance improvement without behavior change |
| `security` | Fixes a vulnerability or hardens access control |

## Scope by Sprint Story

| Story | Scope |
|-------|-------|
| S0 — api scaffolding | `api` or `root` |
| S1 — database | `db` |
| S2 — edge functions | `functions` |
| S3 — types | `models` |
| S4 — services | `services` |
| S5 — shared components | `shared` |
| S6 — routing/guards | `routing` |
| S7 — admin page | `admin` |
| S8 — join page | `join` |
| S9 — reveal page | `reveal` |
| S10 — create-group page | `create-group` |
| S11 — groups page | `groups` |
| S12 — auth pages | `auth` |
| S13 — navigation | `nav` |
| S14 — resource() migration | use the component scope |
| S15 — tests | `test` + component scope |
| S16 — documentation | `docs` |

## Exact Commit Per Task

Consult the **Tabela de Commits por Task** in `@sprint.md` for the exact commit message of each task. Do not deviate from those messages unless the scope of the task genuinely changed.

## Body Rules

- Only add a body when the REASON is non-obvious.
- Never describe WHAT was done (the diff shows this) — only WHY.
- Write in English (consistent with existing git history).

## Anti-Patterns (FORBIDDEN)

```bash
# Too vague
git commit -m "fix stuff"

# Too broad (multiple tasks in one commit)
git commit -m "feat: implement all security features"

# Describes what, not why (use body for this only when needed)
git commit -m "add drawn_at null check to AdminPage"

# Wrong type (this is security, not a feature)
git commit -m "feat(db): hide drawn_participant_id"
```
