# Project Rules

## Context

Groupon case study prototype: AI-powered merchant platform with conversational onboarding, 7-step deal builder, 12-page merchant portal, and pipeline admin panel. Built with React/TypeScript frontend + Python/FastAPI backend.

See `case-study/internal/CLAUDE.md` for the original project brief and PRD.

## Multi-Session Workflow

This project uses multiple Claude sessions in parallel (e.g., main build session + code review session).

### Rules for review/audit sessions
- **Do NOT edit shared deliverables** directly: `decisions.md`, `CASE_STUDY.md`, `iteration-log.md`, `video-script.md`, `flow-mapping.md`, `README.md`
- Write all findings and recommendations to `case-study/reviews/` (create the directory if needed)
- Use a descriptive filename: `code-review-YYYY-MM-DD.md`, `security-audit.md`, etc.
- If proposing new decisions, label them with a temporary prefix (e.g., `CR-001`) — the main session assigns final numbers

### Rules for the main build session
- Integrates review findings into shared deliverables
- Owns the decision numbering sequence (currently 001-016)
- Resolves conflicts between sessions

## Shared File Ownership

| File | Owner | Others may... |
|------|-------|---------------|
| `case-study/deliverables/decisions.md` | Main session | Read only, propose via reviews/ |
| `case-study/deliverables/CASE_STUDY.md` | Main session | Read only |
| `case-study/deliverables/iteration-log.md` | Main session | Read only |
| `case-study/deliverables/video-script.md` | Main session | Read only |
| `backend/main.py` | Main session | Read only, propose fixes via reviews/ |
| `frontend/src/**` | Main session | Read only, propose fixes via reviews/ |
| `case-study/reviews/*` | Review sessions | Main session reads and integrates |
