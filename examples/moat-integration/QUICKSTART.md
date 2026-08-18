# 🚀 DSH + Moat Integration — 快速开始

## 前提

1. ✅ DSH Fork 仓库已克隆
2. ✅ Moat 已安装: `pip install moat-ai`
3. ✅ Moat 在 PATH: `moat --version`

## 安装

### 1. 安装依赖

```bash
cd /path/to/deepseek-harness
pnpm install
```

### 2. 构建插件

```bash
cd packages/local/moat-integration
pnpm run build
```

### 3. 运行 DSH + Moat

```bash
cd /path/to/deepseek-harness
pnpm dsh --profile examples/dsh-moat.cordis.yml
```

## 测试

### 在 DSH 中使用

```
请运行 Moat 检查
```

DSH 将调用 `moat_check` 工具并返回结果。

## 目录结构

```
deepseek-harness/
├── packages/
│   └── local/
│       └── moat-integration/          # ← 插件代码
│           ├── src/
│           │   ├── index.ts           # 插件入口
│           │   ├── moat-types.ts      # TypeScript 类型
│           │   ├── moat-parser.ts     # 输出解析器
│           │   ├── moat-client.ts     # Moat 客户端
│           │   └── tools/             # 工具定义
│           │       ├── moat-check.ts
│           │       ├── moat-report.ts
│           │       └── moat-north-star.ts
│           ├── tests/
│           │   ├── moat-parser.test.ts
│           │   └── moat-client.test.ts
│           ├── package.json
│           └── tsconfig.json
│
└── examples/
    └── dsh-moat.cordis.yml            # ← 配置
```

## 开发

### 添加新工具

1. 在 `src/tools/` 创建新的工具文件
2. 在 `src/index.ts` 的 `inject` 数组中注册
3. 构建和测试

### 调试

```bash
# 启用详细日志
pnpm dsh --profile examples/dsh-moat.cordis.yml --verbose
```

## 故障排除

### Moat 未找到

```bash
# 验证安装
moat --version

# 检查 PATH
which moat
```

### 构建失败

```bash
# 清理并重新安装
pnpm install
pnpm run build
```

## 下一步

- [ ] 添加更多 Moat 命令支持（`moat review`、`moat fix`）
- [ ] 实现 Maven 集成（按需触发检查）
- [ ] 添加历史趋势跟踪
- [ ] 集成到 CI/CD（在 GitHub Actions 中使用）
