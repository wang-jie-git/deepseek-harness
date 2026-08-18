import { describe, it, expect, beforeEach } from 'vitest';
import { parseMoatOutput } from '../src/moat-parser.js';
import type { MoatReport } from '../src/moat-types.js';

describe('Moat Parser', () => {
  describe('parseMoatOutput', () => {
    it('应该解析快速检查输出', () => {
      const output = `
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
`;

      const report: MoatReport = parseMoatOutput(output);

      expect(report.projectType).toContain('python');
      expect(report.projectType).toContain('typescript');
      expect(report.mode).toBe('quick');
      expect(report.summary.total).toBe(4);
      expect(report.summary.passed).toBe(3);
      expect(report.summary.warnings).toBe(1);
      expect(report.results.length).toBe(4);

      // 检查 SQL-002 警告
      const sqlResult = report.results.find(r => r.name.includes('SQL'));
      expect(sqlResult).toBeDefined();
      expect(sqlResult?.type).toBe('warn');
      expect(sqlResult?.issues.length).toBe(1);
      expect(sqlResult?.issues[0].file).toBe('main.py');
      expect(sqlResult?.issues[0].line).toBe(42);
      expect(sqlResult?.issues[0].suggestion).toBeDefined();
    });

    it('应该处理无问题的情况', () => {
      const output = `
📊 项目类型: Python
🔧 检查模式: quick

▸ SECRETS-001 硬编码密钥检测...
  ✅ 通过: 0 个硬编码密钥
▸ SQL-002 SQL 注入检测...
  ✅ 通过: 0 个 SQL 注入

📊 检查结果: 通过 2, 失败 0, 警告 0, 跳过 0, 耗时 0.45s
`;

      const report: MoatReport = parseMoatOutput(output);

      expect(report.isSuccess).toBe(true);
      expect(report.summary.failed).toBe(0);
      expect(report.summary.warnings).toBe(0);
    });

    it('应该处理失败检查', () => {
      const output = `
▸ SECRETS-001 硬编码密钥检测...
  ❌ 失败: 发现 2 个硬编码密钥
    📄 config.py:15
    💡 建议: 使用环境变量
    📄 auth.py:23
    💡 建议: 使用密钥管理服务

📊 检查结果: 通过 0, 失败 1, 警告 0, 跳过 0, 耗时 0.23s
`;

      const report: MoatReport = parseMoatOutput(output);

      expect(report.isSuccess).toBe(false);
      expect(report.summary.failed).toBe(1);
      expect(report.results[0].issues.length).toBe(2);
    });

    it('应该处理空输出', () => {
      const output = '';

      const report: MoatReport = parseMoatOutput(output);

      expect(report.results.length).toBe(0);
      expect(report.summary.total).toBe(0);
      expect(report.isSuccess).toBe(true);
    });

    it('应该解析项目类型', () => {
      const output = `
📊 项目类型: Python, TypeScript, Go
`;

      const report: MoatReport = parseMoatOutput(output);

      expect(report.projectType).toContain('python');
      expect(report.projectType).toContain('typescript');
      expect(report.projectType).toContain('go');
    });

    it('应该解析不同的检查模式', () => {
      const outputFull = `
🔧 检查模式: full
`;
      const outputLegacy = `
🔧 检查模式: legacy
`;

      expect(parseMoatOutput(outputFull).mode).toBe('full');
      expect(parseMoatOutput(outputLegacy).mode).toBe('legacy');
    });
  });
});
