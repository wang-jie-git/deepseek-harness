/**
 * Moat 客户端
 * 通过子进程调用 Moat CLI
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { MoatCheckArgs, MoatReport } from './moat-types.js';
import { parseMoatOutput } from './moat-parser.js';

const execAsync = promisify(exec);

/**
 * Moat 客户端类
 * 封装对 Moat CLI 的调用
 */
export class MoatClient {
  private moatPath: string;

  constructor(moatPath?: string) {
    // 默认使用 'moat'，可自定义路径
    this.moatPath = moatPath || 'moat';
  }

  /**
   * 运行 Moat 检查
   */
  async check(args: MoatCheckArgs): Promise<MoatReport> {
    const cmdArgs = ['check'];

    // 模式
    if (args.mode === 'full') cmdArgs.push('--full');
    else if (args.mode === 'legacy') cmdArgs.push('--legacy');
    else cmdArgs.push('--quick');

    // 项目路径
    if (args.projectPath) {
      cmdArgs.push('--project', args.projectPath);
    }

    // 详细模式
    if (args.verbose) {
      cmdArgs.push('--verbose');
    }

    // 跳过架构检查
    if (args.skipArchitecture) {
      cmdArgs.push('--skip-architecture');
    }

    try {
      const cmd = `${this.moatPath} ${cmdArgs.join(' ')}`;
      const { stdout, stderr } = await execAsync(cmd, {
        timeout: 300000, // 5 分钟超时
        maxBuffer: 10 * 1024 * 1024, // 10MB 输出缓冲区
      });

      // 合并 stdout 和 stderr
      const output = stdout + (stderr ? '\n' + stderr : '');

      // 解析输出
      return parseMoatOutput(output);
    } catch (error) {
      // Moat 返回非零退出码视为检查失败，但解析输出
      if (error instanceof Error) {
        const execError = error as NodeJS.ErrnoException & {
          stdout?: string;
          stderr?: string;
        };

        const output =
          (execError.stdout || '') + '\n' + (execError.stderr || '');

        // 即使失败也尝试解析
        return parseMoatOutput(output);
      }

      throw error;
    }
  }

  /**
   * 检查 Moat 是否可用
   */
  async checkAvailability(): Promise<boolean> {
    try {
      await execAsync(`${this.moatPath} --version`);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * 便捷函数：运行快速检查
 */
export async function quickCheck(projectPath?: string): Promise<MoatReport> {
  const client = new MoatClient();
  return client.check({
    mode: 'quick',
    projectPath,
  });
}

/**
 * 便捷函数：运行完整检查
 */
export async function fullCheck(projectPath?: string): Promise<MoatReport> {
  const client = new MoatClient();
  return client.check({
    mode: 'full',
    projectPath,
  });
}

/**
 * 格式化为人类可读的报告
 */
export function formatReport(report: MoatReport): string {
  const lines: string[] = [
    `🛡️ Moat 代码质量检查报告`,
    `时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`,
    `项目: ${report.projectRoot}`,
    `类型: ${report.projectType.join(', ')}`,
    `模式: ${report.mode}`,
    '',
    `📊 汇总: 通过 ${report.summary.passed} | 失败 ${report.summary.failed} | 警告 ${report.summary.warnings} | 跳过 ${report.summary.skipped}`,
    `⏱️  耗时: ${(report.duration / 1000).toFixed(2)}s`,
    '',
  ];

  // 添加详细结果
  if (report.results.length > 0) {
    lines.push('---');
    lines.push('');

    for (const result of report.results) {
      const icon = result.type === 'pass' ? '✅' : result.type === 'fail' ? '❌' : result.type === 'warn' ? '⚠️' : '⏭️';
      lines.push(`${icon} ${result.name}`);

      if (result.issues.length > 0) {
        for (const issue of result.issues) {
          const fileInfo = issue.line ? `${issue.file}:${issue.line}` : issue.file;
          lines.push(`   • [${issue.severity}] ${issue.ruleId}: ${issue.message}`);
          lines.push(`     📄 ${fileInfo}`);
          if (issue.suggestion) {
            lines.push(`     💡 ${issue.suggestion}`);
          }
        }
      }

      if (result.error) {
        lines.push(`   ✗ 错误: ${result.error}`);
      }

      lines.push('');
    }
  }

  // 添加结论
  lines.push('---');
  if (report.isSuccess) {
    lines.push('✅ 检查通过！未发现严重问题。');
  } else {
    lines.push(`❌ 检查失败，发现 ${report.summary.failed} 个问题需要修复。`);
  }

  return lines.join('\n');
}
