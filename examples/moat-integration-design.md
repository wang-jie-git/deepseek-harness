# 🛡️ DSH Moat Integration Plugin — 开发计划

## 🎯 目标

在 DeepSeek Harness 中集成 Moat 代码质量检查工具，让 DSH Agent 可以在执行任务时自动触发 Moat 检查，或让用户通过 DSH 界面手动触发。

---

## 📋 功能设计

### 核心能力

1. **Moat 检查工具（moat_check）**
   - 运行快速检查（git diff 模式）
   - 运行完整检查（所有文件）
   - 返回结构化结果（passed/failed/warnings）

2. **Moat 报告查看器（moat_report）**
   - 查看检查报告
   - 获取详细错误信息

3. **Moat 自动修复建议（moat_fix）**
   - 分析 Moat 错误
   - 提供修复建议

4. **North Star 架构导航（moat_north_star）**
   - 初始化架构蓝图
   - 检查架构漂移
   - 生成架构健康报告

---

## 🏗️ 架构设计

### 插件结构

```
packages/local/moat-integration/
├── src/
│   ├── index.ts              # 插件入口
│   ├── moat-client.ts         # Moat 子进程通信
│   ├── moat-types.ts          # TypeScript 类型定义
│   ├── moat-parser.ts         # Moat 输出解析器
│   └── tools/
│       ├── moat-check.ts      # moat_check 工具
│       ├── moat-report.ts     # moat_report 工具
│       └── moat-north-star.ts # moat_north_star 工具
├── tests/
│   └── moat-integration.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 关键决策

#### 通信方式：子进程 vs Python API

**子进程（推荐）** ✅
```typescript
// 调用 Moat CLI
const result = await exec('moat', ['check', '--quick', '--json']);
```

优点：
- ✅ 无需安装 Python 依赖
- ✅ Moat 版本独立
- ✅ 进程隔离，安全
- ✅ Moat v1.7.17+ 支持 `--json` 输出

缺点：
- ⚠️ 需要 moat 在 PATH 中
- ⚠️ 启动开销（~100ms）

**Python API（备选）**
```typescript
// 直接调用 Python 模块
const result = await exec('python3', ['-m', 'moat', 'check', '--json']);
```

优点：
- ✅ 无需 moat 在 PATH
- ✅ 可以指定 Python 版本

---

## 📊 Moat 输出格式

### Moat Check（快速模式）

```bash
$ moat check --quick

🔒 运行快速门禁检查...

==================================================
  Moat — AI 编码护城河
  /Users/mac/project
  2026-08-16 10:30:00
==================================================

📊 项目类型: Python, TypeScript
🔧 检查模式: quick

▸ SECRETS-001 硬编码密钥检测...
  ✅ 通过: 0 个硬编码密钥
▸ SQL-002 SQL 注入检测...
  ⚠️ 警告: 发现 1 个潜在 SQL 注入
    📄 main.py:42
    💡 建议: 使用参数化查询
▸ DEPS-001 依赖安全检查...
  ✅ 通过: 0 个已知漏洞
▸ API-002 API 鉴权检查...
  ✅ 通过: 0 个缺失鉴权

📊 检查结果: 通过 3, 失败 0, 警告 1, 跳过 0, 耗时 0.85s
```

### Moat JSON 输出（需要解析）

Moat 暂时**没有内置 `--json` 标志**，我们需要：
1. **解析文本输出**（稳定但脆弱）
2. **调用 Python API 并序列化结果**（推荐）

---

## 🚀 实现步骤

### Step 1：基础插件结构

创建 `packages/local/moat-integration/`

### Step 2：Moat 客户端

实现子进程通信层

### Step 3：工具定义

- `moat_check`：运行 Moat 检查
- `moat_report`：查看详细报告
- `moat_north_star`：架构导航

### Step 4：集成到 cordis.yml

```yaml
plugins:
  - id: moat-integration
    source: ./packages/local/moat-integration/src/index.ts
    config:
      mode: quick
      autoRunOnFileChange: true
```

---

## 📝 已知限制

1. **Moat 没有 JSON 输出**：需要解析文本或调用 Python API
2. **Moat 在 PATH 中**：用户需要先安装 Moat
3. **性能开销**：每次检查 ~1 秒

---

## 🎯 MVP 范围

**第一版（v0.1.0）**：
- ✅ `moat_check` 工具（快速模式）
- ✅ 基础错误解析
- ✅ 简单的修复建议

**第二版（v0.2.0）**：
- ✅ `moat_report` 工具
- ✅ `moat_north_star` 工具
- ✅ North Star 架构蓝图查看

**第三版（v1.0.0）**：
- ✅ 自动触发检查（文件保存时）
- ✅ 集成到 CI/CD
- ✅ 历史趋势图
