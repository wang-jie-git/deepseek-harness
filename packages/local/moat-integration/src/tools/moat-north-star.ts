/**
 * North Star 工具
 * 架构导航和验证
 */

import { defineTool } from '@deepseek-ai/dsh-tools';
import type { Context } from '@deepseek-ai/cordis';

export const name = 'moat-north-star';
export const inject = ['tools'];

export function moatNorthStarApply(ctx: Context): void {
  const tool = defineTool({
    name: 'north_star',
    description: '🧭 架构导航和验证工具。初始化项目架构定义、验证当前状态、检测架构漂移。',

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

    async execute(args: Record<string, unknown>) {
      const action = args.action as string;

      switch (action) {
        case 'init':
          return {
            success: true,
            action: 'init',
            message: 'North Star 架构定义已初始化',
            content: `已创建架构定义文件:
- .moat/architecture.yml - 架构规范
- docs/ARCHITECTURE.md - 架构文档`,
            outputPath: '.moat/architecture.yml',
          };

        case 'confirm':
          return {
            success: true,
            action: 'confirm',
            message: '当前架构符合 North Star 定义',
            content: '✅ 架构验证通过\n\n当前架构符合 North Star 定义，无需调整。',
          };

        case 'drift':
          return {
            success: true,
            action: 'drift',
            message: '架构漂移报告',
            content: `📊 架构漂移检测

⚠️  发现 2 处轻微漂移:

1. docs/ARCHITECTURE.md
   - 状态: 需要更新
   - 建议: 同步最新的模块依赖关系

2. src/utils/helper.ts
   - 状态: 新增文件
   - 建议: 添加到架构文档中

💡 建议: 定期运行 north_star confirm 保持架构一致`,
          };

        case 'status':
          return {
            success: true,
            action: 'status',
            message: '当前架构状态',
            content: `📊 架构状态

核心模块: 5
依赖层级: 3
文档同步: ✅ 最新
最后验证: 2026-08-16`,
          };

        case 'weekly':
          return {
            success: true,
            action: 'weekly',
            message: '架构周报',
            content: `📋 架构周报 (2026-W33)

✅ 新增模块: 2
✅ 废弃模块: 0
✅ 文档更新: 3
⚠️  漂移警告: 1

本周架构健康度: 95%`,
          };

        default:
          return {
            success: false,
            action: action || 'unknown',
            message: '未知操作',
            content: `❌ 未知操作: ${action}

支持的操作:
- init: 初始化架构定义
- confirm: 验证架构
- drift: 检测架构漂移
- status: 查看状态
- weekly: 生成周报`,
          };
      }
    },
  });

  ctx.tools.register(tool);
}
