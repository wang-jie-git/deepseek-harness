/**
 * Moat 类型定义
 * 对应 Moat 检查结果的数据结构
 */

/** Moat 检查的严重级别 */
export type MoatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

/** Moat 检查结果类型 */
export type MoatCheckType = 'pass' | 'fail' | 'warn' | 'skip' | 'error';

/** 单个检查项目 */
export interface MoatIssue {
  ruleId: string;              // 例如：SECRETS-001, SQL-002
  severity: MoatSeverity;      // 严重级别
  message: string;             // 问题描述
  file: string;                // 文件路径
  line?: number;                // 行号（可选）
  column?: number;              // 列号（可选）
  suggestion?: string;          // 修复建议
  context?: Record<string, unknown>; // 额外的上下文数据
}

/** 单个检查的结果 */
export interface MoatCheckResult {
  name: string;                // 检查名称
  type: MoatCheckType;         // pass/fail/warn/skip
  issues: MoatIssue[];         // 发现的问题列表
  duration: number;            // 执行时间（毫秒）
  error?: string;              // 检查过程出错时的错误信息
}

/** 项目类型 */
export type ProjectType =
  | 'python'
  | 'typescript'
  | 'javascript'
  | 'go'
  | 'rust'
  | 'unknown';

/** Moat 完整报告 */
export interface MoatReport {
  projectRoot: string;
  projectType: ProjectType[];
  mode: 'quick' | 'full' | 'legacy';
  timestamp: string;
  duration: number;
  results: MoatCheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
  };
  isSuccess: boolean;
}

/** Moat 工具参数 */
export interface MoatCheckArgs {
  mode?: 'quick' | 'full' | 'legacy';
  projectPath?: string;
  verbose?: boolean;
  skipArchitecture?: boolean;
}

/** Moat 报告查看参数 */
export interface MoatReportArgs {
  format: 'summary' | 'detailed' | 'json';
  severity?: MoatSeverity;
  ruleId?: string;
}

/** North Star 参数 */
export interface MoatNorthStarArgs {
  action: 'init' | 'confirm' | 'drift' | 'status' | 'weekly';
  projectPath?: string;
  storeMemory?: boolean;
}
