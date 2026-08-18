/**
 * Moat Check 工具
 * 运行代码质量检查
 */

import { defineTool } from '@deepseek-ai/dsh-tools';
import type { Context } from '@deepseek-ai/cordis';
import type { MoatCheckArgs } from '../moat-types.ts';
import type { MoatReport } from '../moat-parser.ts';
import { MoatClient, formatReport } from '../moat-client.ts';

export const name = 'moat-check';
export const inject = ['tools', 'systemPrompt'];

export function moatCheckApply(
  ctx: Context,
  _config: { mode?: string } = {}
): void {
  const tool = defineTool({
    name: 'moat_check',
    description: '🛡️ 运行 Moat 代码质量检查。在改代码前后运行，确保系统完整性。支持快速模式（默认，< 5 秒）、完整模式（所有文件 + 复杂规则）、和旧版模式。',

    parameters: {},

    output: {
      schema: {},
      render: (_args: unknown, value: unknown) => [
        {
          type: 'text',
          text: (value as { formattedReport: string }).formattedReport,
        },
      ],
    },

    async execute(args: MoatCheckArgs) {
      const client = new MoatClient();

      // 先检查 Moat 是否可用
      const available = await client.checkAvailability();
      if (!available) {
        throw new Error(
          'Moat 未安装或不在 PATH 中。请先安装：\n' +
            '  pip install moat-ai\n' +
            '  https://github.com/wang-jie-git/moat'
        );
      }

      // 运行检查
      const report = await client.check({
        mode: args.mode,
        projectPath: args.projectPath,
        verbose: args.verbose,
        skipArchitecture: args.skipArchitecture,
      });

      // 提取所有问题
      const issues = report.results.flatMap(r =>
        r.issues.map(issue => ({
          ruleId: issue.ruleId,
          severity: issue.severity,
          message: issue.message,
          file: issue.file,
          line: issue.line,
          suggestion: issue.suggestion,
        }))
      );

      return {
        success: report.isSuccess,
        summary: report.summary,
        duration: report.duration,
        mode: report.mode,
        issues,
        formattedReport: formatReport(report),
      };
    },
  });

  ctx.tools.register(tool);

  ctx.systemPrompt?.section({
    name: 'tool:moat_check',
    order: 200,
    text: 'Use `moat_check` to run code quality checks before and after changes. Run in `quick` mode by default; use `full` for comprehensive analysis.',
  });
}
