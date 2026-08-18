# Moat Integration — 插件开发清单

## ✅ 已完成

### 核心功能
- [x] moat_check 工具（快速/完整/旧模式）
- [x] moat_report 工具（报告生成）
- [x] moat_north_star 工具（架构导航）
- [x] Moat 子进程客户端
- [x] Moat 输出解析器（文本 → JSON）

### 代码质量
- [x] TypeScript 类型定义
- [x] 单元测试（解析器、客户端）
- [x] 插件入口点
- [x] 文档（README + 快速开始）

### 配置
- [x] 示例 cordis.yml
- [x] package.json + tsconfig.json
- [x] .gitignore 支持

## 🚧 TODO

### 短期（v0.2.0）
- [ ] moat_review 工具（AI 对抗性审查）
- [ ] moat_fix 工具（AI 辅助修复）
- [ ] 修复建议增强（更智能的修复提示）
- [ ] 在变更前自动触发检查（pre-commit hook）

### 中期（v0.3.0）
- [ ] 历史趋势图（保存检查历史）
- [ ] 与 One Memory 集成（持久化记忆）
- [ ] Web UI 集成（可视化报告）
- [ ] CI/CD 集成（GitHub Actions / GitLab CI）

### 长期（v1.0.0）
- [ ] 实时监控（文件保存时自动检查）
- [ ] 多项目支持（监控多个仓库）
- [ ] 团队协作（共享规则 + 基线）
- [ ] 自定义规则引擎

## 🎯 优先级

| 功能 | 优先级 | 复杂度 |
|------|--------|--------|
| moat_check | P0 | ⭐⭐ |
| moat_north_star | P1 | ⭐⭐⭐ |
| moat_report | P1 | ⭐ |
| moat_review | P2 | ⭐⭐⭐⭐ |
| 实时监控 | P2 | ⭐⭐⭐⭐ |
| CI/CD 集成 | P2 | ⭐⭐ |
| 历史趋势 | P3 | ⭐⭐⭐ |
