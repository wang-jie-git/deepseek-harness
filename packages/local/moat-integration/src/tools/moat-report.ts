/**
 * Moat Report 工具
 * 生成代码质量报告
 */

import { defineTool } from '@deepseek-ai/dsh-tools';
import type { Context } from '@deepseek-ai/cordis';
import { MoatClient, formatReport } from '../moat-client.ts';

export const name = 'moat-report';
export const inject = ['tools'];

export function moatReportApply(ctx: Context): void {
  const tool = defineTool({
    name: 'moat_report',
    description: '📊 生成 Moat 代码质量检查报告（Markdown/HTML/JSON）',

    parameters: {},

    output: {
      schema: {},
      render: (_args: unknown, value: unknown) => [
        {
          type: 'text',
          text: (value as { content: string }).content,
        },
      ],
    },

    async execute() {
      const client = new MoatClient();

      const available = await client.checkAvailability();
      if (!available) {
        throw new Error(
          'Moat 未安装。请先安装：pip install moat-ai'
        );
      }

      const report = await client.check({ mode: 'quick' });

      return {
        success: true,
        message: '报告生成成功',
        content: formatReport(report),
      };
    },
  });

  ctx.tools.register(tool);
}
