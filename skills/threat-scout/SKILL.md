---
name: threat-scout
description: "Run a full security audit workflow for a codebase. Use when the user asks for a security audit, vulnerability review, full code security review, entrypoint-based audit, OWASP-style review, or wants confirmed findings with PoCs and audit artifacts. Focuses on reproducible, evidence-backed issues rather than speculative best-practice comments."
---

# Threat Scout

Use this skill for full security audits where the goal is to find confirmed, exploitable issues and leave durable audit artifacts. Do not modify the target project unless the user explicitly asks for fixes.

## Core Rule

Write audit artifacts under `.audit-artifacts/` in the target project:

```text
.audit-artifacts/
  entrypoints/   # route, handler, queue, webhook, CLI, frontend event inventory
  analysis/      # architecture notes and high-risk paths
  issues/        # one confirmed issue per markdown file
  verify/        # PoC or verification scripts
  audit-log.md   # round-by-round progress
  memory.md      # false positives, fixed issues, high-risk areas
```

## Reference Material

This skill includes the original audit knowledge as progressively loaded references:

- `references/review-methodology.md`: full audit workflow, artifact layout, issue format, iteration strategy.
- `references/rules/_sections.md`: rule index and impact ordering.
- `references/rules/*.md`: vulnerability-specific review rules and secure/insecure examples.
- `references/guides/entrypoints.md`: entrypoint enumeration patterns.
- `references/guides/{python,typescript,react,fastapi,django,go}.md`: stack-specific review guidance.

Read only the references relevant to the current target. Start with `references/rules/_sections.md` when the risk category is unclear.

For a full audit, read `references/review-methodology.md` before starting. It is the detailed version of this workflow and defines the expected artifacts, issue format, iteration model, and completion rules.

## Reference Selection

Use this map to decide which references to load:

| Situation | Read |
|---|---|
| First pass on any project | `references/review-methodology.md`, `references/guides/entrypoints.md`, `references/rules/_sections.md` |
| Python service | `references/guides/python.md` |
| FastAPI service | `references/guides/fastapi.md`, `references/rules/framework-fastapi.md` |
| Django / DRF service | `references/guides/django.md`, `references/rules/framework-django.md` |
| Go service | `references/guides/go.md` |
| TypeScript / Node service | `references/guides/typescript.md` |
| React frontend | `references/guides/react.md`, `references/rules/xss.md`, `references/rules/prototype-pollution.md` |
| Auth, tenant isolation, object IDs | `references/rules/authentication-jwt.md`, `references/rules/idor.md`, `references/rules/oauth.md` |
| SQL, ORM raw queries, search filters | `references/rules/sql-injection.md` |
| Shell commands or subprocess calls | `references/rules/command-injection.md` |
| File paths, uploads, downloads | `references/rules/path-traversal.md` |
| URL fetches, callbacks, webhooks | `references/rules/ssrf.md` |
| Payment, signing, approvals, state transitions | `references/rules/business-logic.md`, `references/rules/replay-attack.md`, `references/rules/race-condition.md` |
| Secrets, tokens, credentials | `references/rules/secrets.md`, `references/rules/insecure-crypto.md` |
| Docker, Kubernetes, Terraform, GitHub Actions | `references/rules/docker.md`, `references/rules/kubernetes.md`, `references/rules/terraform-aws.md`, `references/rules/terraform-azure.md`, `references/rules/terraform-gcp.md`, `references/rules/github-actions.md` |

## Start Each Round

1. Read `.audit-artifacts/memory.md` if it exists.
   - Skip confirmed false positives and fixed issues.
   - Prioritize recorded high-risk areas.
2. Read `.audit-artifacts/audit-log.md` if it exists.
   - Continue previous TODOs before starting new areas.
3. For a full audit, read `references/review-methodology.md`.
4. Identify the project stack and load relevant references using the Reference Selection table.
5. Read `references/guides/entrypoints.md` before building the first entrypoint inventory.
6. Read the stack-specific guide and top relevant rule files before reporting findings.

If `memory.md` does not exist, create it with:

```markdown
## Confirmed False Positives
## Fixed Issues
## High-Risk Areas
## Audit History
```

## Workflow

### 1. Enumerate Entrypoints

Inventory all attacker-controlled entrypoints before deep-diving:

- Backend: HTTP routes, controllers, handlers, GraphQL, WebSocket, webhooks.
- Async: queues, scheduled jobs, Celery/Kafka/SQS consumers.
- Frontend: routes, URL parameter readers, event handlers, `postMessage`, storage reads, dangerous render sinks.
- CLI or internal tools that process untrusted files, paths, environment values, or network input.

Record each entrypoint with auth method and review status:

```text
<method/path or component/event> | auth | status: reviewed / needs-depth / unreviewed
```

### 2. Review Entrypoints Deeply

For each entrypoint, trace user-controlled data through authentication, authorization, business logic, storage, outbound calls, rendering, and logging.

Prioritize:

- Auth and authorization: bypasses, IDOR, cross-tenant access, missing ownership checks.
- Input to dangerous sinks: SQL, shell, template engines, eval, deserialization, filesystem paths.
- Business logic: payment, signing, approval, state transitions, replay, nonce/timestamp gaps, TOCTOU.
- Data exposure: sensitive response fields, PII/secrets in logs, overbroad serializers.
- Frontend issues: XSS sinks, unsafe `postMessage`, sensitive `localStorage`, untrusted API data rendering.
- Infrastructure paths: Docker, Kubernetes, Terraform, GitHub Actions, secret handling.

### 3. Record Only Evidence-Backed Findings

Do not report:

- Dependency CVEs handled by SCA tools.
- Generic style, performance, or best-practice comments.
- Speculative issues that cannot be tied to an exploit path.
- Paths that require assuming production-only secret/config leakage.

For confirmed issues, create:

- `.audit-artifacts/issues/<short-name>.md`
- `.audit-artifacts/verify/<short-name>.(sh|py|curl)` when practical

### 4. Verify

Every issue should be verified in sandbox/dev when possible.

If blocked, state the blocker precisely:

- Need auth token.
- Need MFA or user action.
- Need test data.
- Need a running service or seed state.

Do not convert blocked hypotheses into confirmed findings.

### 5. End Each Round

Append to `.audit-artifacts/audit-log.md`:

```markdown
## Round N - YYYY-MM-DD
- Scope reviewed:
- New findings:
- Refuted paths:
- TODO:
```

At the end of the audit, update `memory.md` with the audit history and ask the user which findings were false positives.

## Issue Template

```markdown
# <Issue Name>

- **Risk**: CRITICAL / HIGH / MEDIUM / LOW
- **Type**: IDOR / auth bypass / XSS / injection / business logic / ...
- **Entrypoint**: `<method> <path>` or `<component> <event>`
- **Status**: confirmed / blocked / refuted / pending

## Analysis
Reference exact files and lines.

## Attack Path
End-to-end exploitation steps.

## PoC
How to run the verification script or curl command.

## Verification Result
Actual result or exact blocker.

## Fix Recommendation
Concrete remediation tied to the vulnerable code path.
```

## Risk Ratings

| Risk | Use when |
|---|---|
| CRITICAL | Unauthenticated large-scale data exposure, RCE, or full account/system takeover. |
| HIGH | Authenticated low-privilege users can access sensitive data, cause persistent damage, or break key business flows. |
| MEDIUM | Limited impact, meaningful preconditions, non-sensitive exposure, or conditional DoS. |
| LOW | Multiple strong preconditions and minimal practical impact. |

## Completion Criteria

The audit is complete when all entrypoints are reviewed and two consecutive rounds find no new confirmed issues.
