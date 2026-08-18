# 🎯 在 Fork 仓库中开发插件（最小化方案）

## 核心理念

**你不需要创建新仓库！** 只需在你的 fork 中添加插件目录，然后在 `cordis.yml` 中加载它。

---

## ✅ 已完成

我已经在 `/Users/mac/Desktop/deepseek-harness/packages/local/my-tool/` 创建了一个示例插件。

### 插件结构

```
deepseek-harness/                        # 你的 fork
├── packages/
│   ├── core/                            # 官方包（不变）
│   ├── llm/                             # 官方包（不变）
│   └── local/                           # 🎯 你的插件目录
│       └── my-tool/
│           ├── src/index.ts             # 插件代码
│           ├── package.json
│           └── tsconfig.json
│
└── examples/
    └── my-local-plugins.cordis.yml      # 🎯 你的配置
```

---

## 🚀 使用步骤

### 1️⃣ 在 Fork 中开发插件

编辑 `packages/local/my-tool/src/index.ts`：

```typescript
import { tool } from '@deepseek-ai/dsh-tools';
import { z } from '@deepseek-ai/cordis';

// 定义你的工具
const MyArgs = z.object({
  query: z.string()
});

export const myTool = tool({
  name: 'my_tool',
  description: '我的工具',
  parameters: MyArgs,
  async execute(args) {
    return { result: `处理完成: ${args.query}` };
  }
});

// 导出插件
export function myToolPlugin() {
  return {
    name: 'my-tools',
    inject: [{
      key: 'tools',
      apply: (registry) => registry.register(myTool)
    }]
  };
}

export default myToolPlugin;
```

### 2️⃣ 配置 cordis.yml

使用我们刚创建的配置：

```bash
# 在官方仓库运行你的增强版
pnpm dsh --profile examples/my-local-plugins.cordis.yml
```

就这么简单！

---

## 🔄 保持跟随官方更新

```bash
# 1. 拉取官方更新
cd /path/to/deepseek-harness
git fetch upstream
git rebase upstream/main

# 2. 更新依赖
pnpm install

# 3. 测试你的插件
pnpm dsh --profile examples/my-local-plugins.cordis.yml
```

**你的插件在 `packages/local/` 目录**，官方更新不会影响它。

---

## 📊 方案对比

| 方案 | 创建新仓库 | 官方同步 | 复杂度 | 推荐度 |
|------|-----------|---------|--------|--------|
| **A. 在 Fork 中添加插件（当前方案）** | ❌ 不需要 | ✅ 直接 rebase | ⭐ | ⭐⭐⭐⭐⭐ |
| **B. 创建独立增强包仓库** | ✅ 需要 | ⚠️ 管理 workspace | ⭐⭐⭐ | ⭐⭐⭐ |
| **C. 修改官方包** | ❌ 不需要 | ❌ 容易冲突 | ⭐⭐ | ⭐ |

---

## 🎯 为什么这个方案更好？

### ✅ 优势

1. **最小化复杂度**：无需管理多个仓库
2. **自然同步**：官方更新时直接 `git rebase upstream/main`
3. **易于测试**：在同一个仓库中开发和测试
4. **符合 Git 工作流**：你的 fork 就是你自己的版本

### 📁 推荐目录结构

```
deepseek-harness/                        # 你的 fork
├── packages/
│   ├── official/                        # 官方包（不修改）
│   │   ├── core/
│   │   ├── llm/
│   │   └── ...
│   │
│   └── local/                           # 🎯 你的插件
│       ├── my-tool/                     # 插件 1
│       ├── my-provider/                 # 插件 2
│       └── my-agent/                    # 插件 3
│
├── examples/
│   ├── official/                        # 官方示例
│   └── my-plugins.cordis.yml           # 🎯 你的配置
│
└── .gitignore                           # 忽略插件构建产物
```

### 🔒 Git 忽略配置

在 `.gitignore` 中添加：

```gitignore
# 忽略插件构建产物（保留源代码）
/packages/local/*/lib/
/packages/local/*/lib-types/
/packages/local/*/dist/
/packages/local/*/.tsbuildinfo
```

---

## 📦 进阶：如果你想要发布插件

### 方案 1：私有 npm registry

```bash
cd /path/to/deepseek-harness/packages/local/my-tool
pnpm pack
pnpm publish --access restricted --registry https://your-registry.com
```

### 方案 2：Git submodule（团队共享）

```bash
# 创建插件仓库
git init ~/my-dsh-plugins
cd ~/my-dsh-plugins
# 添加插件...

# 在 fork 中添加为 submodule
cd /path/to/deepseek-harness
git submodule add https://github.com/your-org/my-dsh-plugins.git packages/local/my-plugins
```

---

## 🎓 学习资源

参考官方插件开发文档：

- [Adding a Package](docs/cookbook/adding-a-package.md)
- [Adding a Tool](docs/cookbook/adding-a-tool.md)
- [Extension Cookbook](docs/cookbook/extension-cookbook.md)
- [Architecture](docs/architecture.md)

---

## ❓ 下一步

1. **开发插件**：编辑 `packages/local/my-tool/src/index.ts`
2. **构建插件**：`cd packages/local/my-tool && pnpm run build`
3. **测试插件**：`pnpm dsh --profile examples/my-local-plugins.cordis.yml`
4. **添加更多插件**：复制 `my-tool` 目录结构

需要我帮你：
- 实现真实的插件逻辑（比如集成 Moat）？
- 创建更多插件示例（LLM Provider、Agent 等）？
- 配置 CI/CD 自动测试插件？
