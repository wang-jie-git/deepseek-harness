# DSH 插件开发与分发完整指南

## 🔍 核心问题：DSH 有插件商店吗？

**答案：目前没有官方插件商店。**

根据官方文档（CONTRIBUTING.zh.md）：

> DeepSeek Harness 仍处于早期阶段，并在积极开发中。很抱歉，我们目前无法接受外部 PR。

> 但鼓励生态系统：
> - 创建令你感兴趣的插件，并分享给其他人
> - 为你的 GitHub 项目添加 `dsh-plugin` 话题，让其他人更容易找到你的插件

---

## ✅ 你确实可以开发插件并分享

虽然**没有官方插件商店**，但有**三种实际可行的分发方式**：

---

## 📦 方式 1：本地开发 + 个人使用（最简单）

### 适用场景
- 自己用
- 团队内部使用

### 操作
```bash
# 1. 在 fork 中开发插件
cd /path/to/deepseek-harness
mkdir -p packages/local/my-plugin
# ... 开发插件 ...

# 2. 在 cordis.yml 中加载
pnpm dsh --profile examples/my-plugins.cordis.yml
```

### 优点
- ✅ **最简单**：无需发布流程
- ✅ **即时可用**：开发完就能用
- ✅ **完全控制**：不受任何限制

---

## 📦 方式 2：发布到 npm（社区分享）

### 适用场景
- 想分享给社区
- 想建立自己的插件品牌

### 操作

#### 1️⃣ 准备你的插件包

```json
{
  "name": "@your-org/dsh-plugin-moat",
  "version": "0.1.0",
  "private": false,  // ← 改为 false
  "type": "module",
  "description": "Moat 代码质量扫描插件",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "keywords": [
    "deepseek-harness",
    "dsh-plugin",
    "moat",
    "code-quality"
  ],
  "peerDependencies": {
    "@deepseek-ai/cordis": "^0.1.0",
    "@deepseek-ai/dsh-tools": "^0.1.0"
  },
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/dsh-plugin-moat.git"
  }
}
```

#### 2️⃣ 发布到 npm

```bash
cd /path/to/deepseek-harness/packages/local/moat-plugin

# 登录 npm（如果还没登录）
npm login

# 发布
npm publish --access public

# 或者发布到私有 registry
npm publish --registry https://your-registry.com
```

#### 3️⃣ 其他人使用

```bash
# 安装你的插件
pnpm add @your-org/dsh-plugin-moat
```

#### 4️⃣ 在他们的 cordis.yml 中加载

```yaml
plugins:
  - id: moat-scanner
    source: node_modules/@your-org/dsh-plugin-moat/src/index.ts
    config:
      rules: ['SECRETS', 'SQL']
```

### 优点
- ✅ **标准 npm 工作流**：熟悉的发布流程
- ✅ **版本管理**：semver 版本控制
- ✅ **可发现性**：npm 搜索

---

## 📦 方式 3：GitHub + `dsh-plugin` 标签（社区推荐）

### 适用场景
- 开源插件
- 希望社区发现和使用

### 操作

#### 1️⃣ 创建独立的插件仓库

```bash
# 创建专门的插件仓库
mkdir ~/dsh-plugin-moat
cd ~/dsh-plugin-moat
git init
```

**目录结构**：
```
dsh-plugin-moat/
├── src/
│   └── index.ts          # 插件代码
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

#### 2️⃣ 在 GitHub 添加 `dsh-plugin` 标签

```bash
# 推送到 GitHub
git push origin main

# 在 GitHub 仓库设置中添加话题（Topics）
# 在仓库首页点击 ⚙️ 图标，添加：dsh-plugin
```

#### 3️⃣ 用户如何安装

**选项 A：通过 npm**
```bash
pnpm add github:your-org/dsh-plugin-moat
```

**选项 B：通过 Git URL**
```bash
pnpm add git+https://github.com/your-org/dsh-plugin-moat.git
```

**选项 C：直接 clone**
```bash
git clone https://github.com/your-org/dsh-plugin-moat.git ~/dsh-plugins/moat
```

然后在 cordis.yml 中：
```yaml
plugins:
  - id: moat
    source: ~/dsh-plugins/moat/src/index.ts
```

### 优点
- ✅ **官方推荐方式**：符合 CONTRIBUTING 指南
- ✅ **易于发现**：GitHub topic 搜索
- ✅ **灵活**：用户可以选择安装方式

---

## 🔄 未来：官方插件商店？

根据官方态度：

> DeepSeek Harness 的设计支持深度定制。我们并不认为官方仓库中的包天然就比社区开发的包更重要。

**推测**：
- 短期内**不会**有中央插件商店
- 长期可能会有**插件目录/列表**（非强制分发平台）
- 目前鼓励**社区自发分享**（GitHub topic）

---

## 🎯 推荐策略

### 对于你的场景（Moat 集成）

#### 方案 A：内部使用（推荐）

```bash
# 直接在你的 fork 中开发
/path/to/deepseek-harness/packages/local/moat-tool/

# 使用
pnpm dsh --profile examples/my-plugins.cordis.yml
```

#### 方案 B：开源分享（可选）

```bash
# 1. 创建独立仓库
mkdir ~/dsh-plugin-moat
cd ~/dsh-plugin-moat

# 2. 复制插件代码
cp -r /path/to/deepseek-harness/packages/local/moat-tool/* .

# 3. 发布到 GitHub + npm
gh repo create dsh-plugin-moat --public
git push origin main
npm publish

# 4. 添加 topic
# 在 GitHub 仓库设置添加: dsh-plugin
```

---

## 📊 三种方式对比

| 维度 | 本地使用 | npm 发布 | GitHub + topic |
|------|---------|---------|---------------|
| **发布复杂度** | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| **版本管理** | ❌ | ✅ | ⚠️（手动） |
| **社区发现** | ❌ | ⚠️（npm 搜索） | ✅（GitHub） |
| **安装便捷性** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **推荐场景** | 个人/团队 | 品牌插件 | 开源社区 |

---

## 🚀 快速开始：发布你的第一个插件

### 步骤 1：开发插件

```bash
cd /path/to/deepseek-harness
mkdir -p packages/local/moat-tool
# ... 开发中 ...
```

### 步骤 2：测试

```bash
pnpm dsh --profile examples/my-plugins.cordis.yml
```

### 步骤 3：决定分发方式

**如果只是自己用**：停在这里 ✅

**如果要分享给社区**：
```bash
# 选项 A：直接发布到 npm
cd packages/local/moat-tool
npm publish

# 选项 B：创建独立仓库（推荐）
mkdir ~/dsh-plugin-moat
cp -r packages/local/moat-tool/* ~/dsh-plugin-moat/
cd ~/dsh-plugin-moat
gh repo create dsh-plugin-moat --public
git push origin main
# 添加 topic: dsh-plugin
npm publish  # 可选
```

---

## 📚 参考

- [CONTRIBUTING.zh.md](https://github.com/deepseek-ai/deepseek-harness/blob/main/CONTRIBUTING.zh.md)
- [Adding a Tool](https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/cookbook/adding-a-tool.md)
- [Extension Cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/cookbook/extension-cookbook.md)
- GitHub Topics: [`dsh-plugin`](https://github.com/topics/dsh-plugin)

---

## ❓ 常见问题

**Q: DSH 官方未来会有插件商店吗？**  
A: 目前没有计划，但社区可以通过 GitHub `dsh-plugin` topic 分享。

**Q: 我的插件会被官方认可吗？**  
A: 目前官方不接受外部 PR，但你可以通过 GitHub Discussions 分享。

**Q: 插件如何保证安全？**  
A: 插件在 `cordis.yml` 中显式加载，用户完全控制。

**Q: 可以商业化插件吗？**  
A: MIT 许可证允许，但需遵守 DSH 的许可证。
