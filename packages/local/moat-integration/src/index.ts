/**
 * Moat Integration Plugin — DeepSeek Harness
 *
 * 在 DSH 中集成 Moat 代码质量检查工具
 *
 * 功能：
 * - moat_check：运行代码质量检查
 * - moat_report：生成和查看检查报告
 * - moat_north_star：北极星架构导航
 *
 * 使用前提：
 * - Moat 已安装: pip install moat-ai
 * - Moat 在 PATH 中: moat --version
 */

import type { Context } from '@deepseek-ai/cordis';
import { moatCheckApply } from './tools/moat-check.js';
import { moatReportApply } from './tools/moat-report.js';
import { moatNorthStarApply } from './tools/moat-north-star.js';

// 插件名称
const PLUGIN_NAME = 'moat-integration';

/**
 * 插件入口
 * DSH 插件使用 name/inject/apply 模式
 */
export const name = PLUGIN_NAME;
export const inject = ['tools', 'systemPrompt'];

/**
 * 应用插件到 Context
 *
 * @param ctx - Cordis Context
 * @param config - 插件配置
 */
export function apply(ctx: Context, config?: { mode?: string }): void {
  // 注册 moat_check 工具
  moatCheckApply(ctx, config);

  // 注册 moat_report 工具
  moatReportApply(ctx);

  // 注册 moat_north_star 工具
  moatNorthStarApply(ctx);

  console.log(`[${PLUGIN_NAME}] Moat 工具集已注册`);
}
