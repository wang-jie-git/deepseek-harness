# Moat Integration Plugin

DeepSeek Harness 与 Moat 代码质量检查工具的集成插件。

## 功能

| 工具 | 描述 |
|------|------|
| `moat_check` | 🛡️ 运行 Moat 代码质量检查 |
| `moat_report` | 📊 生成和查看 Moat 检查报告 |
| `moat_north_star` | 🧭 北极星架构导航 |

## 安装

### 前置条件

1. **安装 Moat**：
   ```bash
   pip install moat-ai
   ```

2. **验证安装**：
   ```bash
   moat --version
   # moat v1.7.17
   ```

### 加载插件

在 `cordis.yml` 中：

```yaml
plugins:
  - id: moat-integration
    source: ./packages/local/moat-integration/src/index.ts
```

## 使用

### 🛡️ moat_check

运行代码质量检查：

```
请运行 Moat 检查
```

```
请检查当前项目的代码质量
```

**参数**：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `mode` | `quick` \| `full` \| `legacy` | `quick` | 检查模式 |
| `projectPath` | `string` | 当前目录 | 项目根目录 |
| `verbose` | `boolean` | `false` | 详细输出 |
| `skipArchitecture` | `boolean` | `false` | 跳过架构检查 |

**示例输出**：

```
📊 检查结果: 通过 3, 失败 0, 警告 1, 跳过 0, 耗时 0.85s
✅ 检查通过！未发现严重问题。
```

### 📊 moat_report

生成或查看检查报告：

```
生成 Moat 检查报告
```

**参数**：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `command` | `report` \| `rules` | `report` | 报告类型 |
| `format` | `html` \| `json` \| `markdown` | `html` | 报告格式 |

### 🧭 moat_north_star

北极星架构导航：

```
初始化北极星架构蓝图
```

```
检查架构漂移
```

**参数**：

| 参数 | 描述 |
|------|------|
| `action: init` | 初始化架构蓝图 |
| `action: confirm` | 确认并激活蓝图 |
| `action: drift` | 检查架构漂移 |
| `action: status` | 查看当前蓝图 |
| `action: weekly` | 生成周报 |

## 使用场景

### 场景 1：改代码前检查

```
1. 用户：让我修改 authentication.py
2. DSH：先运行 Moat 检查
   → moat_check (mode: quick)
   → 通过，继续
3. DSH：修改代码
4. DSH：再次运行 Moat 检查
   → moat_check (mode: quick)
   → 通过，确认安全
```

### 场景 2：集成到 CI/CD

```
在 CI/CD 流水线中：
1. 拉取代码
2. pnpm dsh --profile my-ci.cordis.yml
3. DSH 调用 moat_check (mode: full)
4. 如果有失败，中断流水线
```

### 场景 3：架构健康监控

```
每周自动运行：
1. moat_north_star (action: weekly)
2. 生成架构健康报告
3. 如果有恶化，发送告警
```

## Model Experience

### Request context and condition

#### What the model sees

工具 `moat_check`、`moat_report`、`moat_north_star` 出现在工具列表中。

#### Token effect

~400 tokens（三个工具的描述 + 参数 schema）

#### KV Cache effect

工具定义在每次请求时重复，不缓存。

## Known Limitations

- **Moat 必须在 PATH 中**：当前版本假设 moat 命令可用
- **解析脆弱性**：解析器依赖 Moat 输出格式，Moat 更新可能破坏解析
- **无 JSON 输出**：Moat v1.7.17 没有内置 `--json` 标志，依赖文本解析
- **性能开销**：每次检查 ~1 秒，完整模式可能更慢

## 故障排除

### Moat 未找到

```
❌ Moat 未安装或不在 PATH 中
```

**解决**：
```bash
pip install moat-ai
```

### 检查超时

完整模式可能超过默认超时。

**解决**：在 cordis.yml 中调整超时或使用 quick 模式。

### 解析失败

如果 Moat 更新了输出格式，解析器可能失败。

**解决**：更新解析器正则或使用 verbose 模式查看原始输出。

## License

MIT © 2026 wangjiezhong
