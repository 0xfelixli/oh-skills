---
name: conduit
version: 1.1.0
description: |
  Conduit CLI skill for Phabricator/Phorge task management. Covers task CRUD,
  Differential revisions, repository browsing, project operations, and raw API calls.
  Use when: creating tasks, updating tasks, searching tasks, reviewing diffs,
  browsing repos, managing projects on Phabricator/Phorge.
allowed-tools:
  - Bash
  - Read
  - Write
  - AskUserQuestion
triggers:
  - create task
  - create phabricator task
  - phabricator
  - conduit task
  - maniphest
---

# Conduit — Phabricator/Phorge CLI Skill

## 配置前提

确保以下环境变量已设置：

```bash
export PHABRICATOR_URL="https://your-phabricator-instance.com/api/"
export PHABRICATOR_TOKEN="your-32-character-token"
# 可选
export PHABRICATOR_PROXY="socks5://127.0.0.1:1080"
export PHABRICATOR_DISABLE_CERT_VERIFY=1
```

验证：`conduit ping` / `conduit user whoami --json`

完整的 agent 使用说明已内置在 CLI 帮助中，随时可查：

```bash
conduit --help
```

---

## 全局标志

`--url` `--token` `--proxy` `--disable-cert-verify` `--timeout N` `--retries N` `--json`

---

## PHID 发现工作流

写入操作（创建/更新）通常需要 PHID，先用这几条命令获取：

```bash
conduit user whoami --json                          # 获取自己的 PHID
conduit user search --usernames alice --json        # 按用户名查 PHID
conduit project get "Backend Team" --json           # 按名称查项目 PHID
conduit repo info backend --json                    # 查仓库 PHID
```

PHID 格式：`PHID-{TYPE}-{hash}`，例如 `PHID-USER-xxx`、`PHID-PROJ-xxx`、`PHID-TASK-xxx`

---

## 任务管理（Maniphest）

### 搜索

```bash
conduit task search --query-key assigned --status open --limit 20
conduit task search --query "login regression"
conduit task search --ids 123,456
conduit task search --constraints '{"statuses":["open"],"projects":["PHID-PROJ-xxx"]}'
```

内置 query-key：`assigned` `authored` `subscribed` `open` `all`

### 获取

```bash
conduit task get T123 --json
```

### 创建

```bash
conduit task create "Fix login regression"
conduit task create "New feature" \
  --description @task.md \
  --owner-phid PHID-USER-xxx \
  --priority 80 \
  --project-phids PHID-PROJ-xxx,PHID-PROJ-yyy \
  --cc-phids PHID-USER-aaa
```

优先级：`0`(低) `25` `50`(普通) `80`(高) `90` `100`(紧急)

### 更新

```bash
conduit task update T123 --status resolved --comment "Fixed in D456"
conduit task update T123 --title "New title" --priority 80
conduit task update T123 --add-projects PHID-PROJ-xxx
conduit task update T123 --set-subscribers PHID-USER-aaa,PHID-USER-bbb
```

状态值：`open` `resolved` `wontfix` `invalid`

### 评论

```bash
conduit task comment T123 "Fixed in commit abc123"
conduit task comment T123 @comment.md
```

### 历史

```bash
conduit task transactions T123
conduit task transactions --phid PHID-TASK-xxx --limit 50
```

---

## 代码审查（Differential）

```bash
conduit diff search --status accepted --author PHID-USER-xxx
conduit diff get D123 --json
conduit diff comment D123 "LGTM!" --action accept   # accept|reject|request-changes|comment
conduit diff update D123 --title "Updated" --comment "addressed review"
conduit diff create-raw @my.patch --repository-phid PHID-REPO-xxx
conduit diff create DIFF_ID "Title" --reviewers PHID-USER-aaa
conduit diff content PHID-DIFF-xxx
conduit diff commit-message D123
```

---

## 仓库操作（Diffusion）

```bash
conduit repo search --query backend --json
conduit repo info backend --json
conduit repo browse backend /src/
conduit repo file backend README.md --commit HEAD
conduit repo history backend --limit 20
conduit repo branches backend
conduit repo commits --repositories PHID-REPO-xxx
```

---

## 项目操作

```bash
conduit project search --query "backend"
conduit project get "Backend Team" --json       # 返回 PHID 等信息
conduit project create "New Project" --icon briefcase --color blue
conduit project update PHID-PROJ-xxx --name "Renamed"
```

---

## 用户操作

```bash
conduit user whoami --json
conduit user search --usernames alice,bob --json
conduit user search --name-like "John"
```

---

## 直接调用任意 API

```bash
conduit call maniphest.search --params '{"constraints":{"statuses":["open"]},"limit":5}'
conduit call maniphest.search --params @params.json
```

---

## 典型工作流

### 创建带项目标签的任务

```bash
# 1. 获取项目 PHID
conduit project get "Backend Team" --json | grep '"phid"'
# 2. 获取负责人 PHID
conduit user search --usernames alice --json | grep '"phid"'
# 3. 创建任务
conduit task create "Implement OAuth2" \
  --description @spec.md \
  --owner-phid PHID-USER-alice \
  --priority 80 \
  --project-phids PHID-PROJ-backend
```

### 批量关闭任务

```bash
for task in T100 T101 T102; do
  conduit task update $task --status resolved --comment "Fixed in v2.1"
done
```

---

## Agent 使用注意事项

- 需要提取数据时始终加 `--json`，输出结果可直接用 `jq` 或 `grep` 处理
- 写入操作优先使用 PHID，不要依赖名称（名称可能变化）
- `--description`、`--comment`、`--summary`、`--test-plan` 均支持：直接字符串 / `@文件路径` / `-`（stdin）
- 多值参数支持逗号分隔或多次 `--flag`
- `conduit task update` 必须至少提供一个更新参数，否则报错
- 不确定有哪些子命令参数时，运行 `conduit <subcommand> --help` 查看
