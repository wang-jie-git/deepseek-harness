# My Tool

## Model Experience

### Request context and condition

#### What the model sees

工具 `code_quality_scanner` 出现在工具列表中，用于扫描代码质量。

#### Token effect

~150 tokens（描述 + 参数 schema）

#### KV Cache effect

工具定义在每次请求时重复，不缓存。

## Known Limitations

- 当前仅返回模拟数据
- TODO: 集成真实扫描引擎
