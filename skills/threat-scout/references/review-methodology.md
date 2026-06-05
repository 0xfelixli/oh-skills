# 全量安全审计方法论

本文件由 `cobo-audit init` 复制到目标项目的 `.audit-skills/` 目录。
审计产物统一写入 `.audit-artifacts/`，不要修改目标项目的其他文件。

---

## 目录结构

```
.audit-artifacts/
├── entrypoints/     # 入口清单（后端：API endpoint；前端：路由/事件处理器）
├── analysis/        # 架构理解、模块关系、高风险代码路径笔记
├── issues/          # 每个确认问题一个 .md
├── verify/          # 每个 issue 对应的 PoC 脚本（.sh / .py / .curl）
├── audit-log.md     # 每轮进度记录（审了什么、遗留什么 TODO）
└── memory.md        # 跨轮持久记忆：误报、已修复、高风险区域
```

---

## 启动流程（每轮第一步）

1. 检查 `.audit-artifacts/memory.md` 是否存在：
   - **存在**：读取"已确认误报"和"已修复问题"，审计全程跳过这些 pattern；读取"高风险区域"，对相关文件加重审查权重
   - **不存在**：创建空文件，填入以下模板：
     ```
     ## 已确认误报
     ## 已修复问题
     ## 高风险区域
     ## 审计历史
     ```

2. 读取 `.audit-artifacts/audit-log.md`，了解上轮审计进度和遗留 TODO

3. 读取 `.audit-skills/skills/rules/` 下与当前项目技术栈相关的规则文件（如 `sql-injection.md`、`authentication-jwt.md`、`idor.md`、`ssrf.md` 等）

---

## 审计流程

### 第一步：枚举入口

找到项目所有入口，记录到 `.audit-artifacts/entrypoints/`，每个模块一个文件。

- **后端**：HTTP endpoint（路由注册、controller、handler）
- **前端**：页面路由、用户交互事件处理、postMessage 处理、URL 参数读取点
- **通用**：定时任务、消息队列消费者、Webhook 接收端

格式：接口/路由列表 + 鉴权方式 + 审查状态（✅ 已审查 / ⚠️ 待深入 / ❌ 未审查）

### 第二步：逐入口深入分析

重点关注：

- **权限控制**：认证是否可绕过？鉴权是否基于用户身份过滤（IDOR）？跨租户隔离是否完整？
- **输入处理**：用户可控输入是否进入 SQL / 命令 / 模板 / 反序列化？
- **业务逻辑**：支付/签名/审批等关键操作是否存在状态绕过、重放（无 nonce/时间窗口）、并发 TOCTOU？
- **数据暴露**：响应是否过度暴露敏感字段？日志是否记录了 PII 或凭证？
- **前端特有**：XSS（`dangerouslySetInnerHTML`、`innerHTML`、`eval`）、`postMessage` 来源未校验、敏感数据存入 `localStorage`

### 第三步：记录发现

**确认问题** → `.audit-artifacts/issues/<name>.md`（格式见下）

**PoC 脚本** → `.audit-artifacts/verify/<name>.sh` 或 `.py`，可直接执行

**代码理解** → `.audit-artifacts/analysis/<topic>.md`，记录架构、模块关系、高风险路径

### 第四步：更新进度

每轮结束时在 `.audit-artifacts/audit-log.md` 追加：
```
## Round N — YYYY-MM-DD
- 审查范围：...
- 新发现：...
- TODO：...
```

---

## 不上报的类型

- 组件版本 CVE、依赖漏洞（由独立 SCA 工具处理）
- 代码规范偏差、性能建议、最佳实践
- 无法明确验证的推测性问题
- 仅凭生产配置泄露才能利用的路径（不要假设代码中的配置与 prod 相同）

---

## Issue 格式

`.audit-artifacts/issues/<name>.md`：

```markdown
# <漏洞名称>

- **风险等级**：CRITICAL / HIGH / MEDIUM / LOW
- **漏洞类型**：IDOR / 权限绕过 / XSS / 注入 / 业务逻辑 / …
- **影响入口**：`<HTTP方法> <路径>` 或 `<组件> <事件>`
- **状态**：confirmed / blocked / refuted / pending

## 漏洞分析
（引用具体文件路径和行号）

## 攻击路径
（端到端可操作步骤）

## PoC
（对应 verify/<name>.sh 的执行说明，或内联 curl 命令）

## 验证结果
（实际执行结果，或阻碍原因）

## 修复建议
```

---

## 风险等级

| 等级 | 判定依据 |
|------|---------|
| **CRITICAL** | 无需认证，可直接造成大规模数据泄露、RCE 或全量权限接管 |
| **HIGH** | 低权限或认证用户可造成敏感数据泄露、持久破坏、或影响关键业务流程 |
| **MEDIUM** | 影响有限或需一定前置条件；泄露非敏感状态、条件性 DoS |
| **LOW** | 需多重前置条件，影响极小、无持久破坏 |

---

## 迭代策略

每轮约 30 分钟。下轮开始前先读 `audit-log.md`，不要重复已完成的分析。

- 优先处理上轮 TODO
- 无 TODO 时，从 `entrypoints/` 中挑选 ❌ 或 ⚠️ 的入口继续
- **所有入口标记为 ✅，且连续两轮无新 issue，报告审计完成**

---

## 验证说明

每条 issue 必须在 sandbox/dev 环境验证：

- 需要认证 token → 向用户索取
- 需要 MFA 操作 → 告知用户需要做什么，等用户完成后继续
- 需要特殊测试数据 → 向用户说明

---

## 审计结束时

在 `.audit-artifacts/memory.md` 的"审计历史"章节追加一行记录，并询问用户哪些 findings 是误报，将误报追加到"已确认误报"章节。
