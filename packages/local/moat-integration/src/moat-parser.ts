/**
 * Moat 输出解析器
 * 解析 Moat CLI 的文本输出为结构化数据
 */

import type { MoatReport, MoatCheckResult, ProjectType } from './moat-types.js';

/** 正则模式 */
const PATTERNS = {
  // 匹配检查开始：▸ SECRETS-001 硬编码密钥检测...
  checkStart: /^\s*▸\s+(.+?)\s*\.{3}\s*$/,

  // 匹配通过：✅ 通过: 0 个硬编码密钥
  pass: /^\s*✅\s+通过[::]\s+(.+)$/,

  // 匹配失败：❌ 失败: 发现 2 个问题
  fail: /^\s*❌\s+失败[::]\s+(.+)$/,

  // 匹配警告：⚠️ 警告: 发现 1 个潜在 SQL 注入
  warn: /^\s*⚠️\s+警告[::]\s+(.+)$/,

  // 匹配文件位置：📄 main.py:42
  fileLocation: /^\s*📄\s+(.+?)(?::(\d+))?$/,

  // 匹配建议：💡 建议: 使用参数化查询
  suggestion: /^\s*💡\s+建议[::]\s+(.+)$/,

  // 匹配项目类型：📊 项目类型: Python, TypeScript
  projectType: /^\s*📊\s+项目类型[::]\s+(.+)$/,

  // 匹配检查模式：🔧 检查模式: quick
  checkMode: /^\s*🔧\s+检查模式[::]\s+(.+)$/,

  // 匹配结果摘要：📊 检查结果: 通过 3, 失败 0, 警告 1, 跳过 0, 耗时 0.85s
  summary: /^\s*📊\s+检查结果[::]\s+(.+)$/,

  // 匹配错误：✗ 错误信息
  error: /^\s*✗\s+(.+)$/,

  // 匹配跳过：⏭️ 跳过: ...
  skip: /^\s*⏭️\s+跳过[::]\s+(.+)$/,
};

/**
 * 解析 Moat CLI 输出
 */
export function parseMoatOutput(output: string): MoatReport {
  const lines = output.split('\n');
  const results: MoatCheckResult[] = [];
  let currentCheck: MoatCheckResult | null = null;
  let projectType: ProjectType[] = [];
  let mode: MoatReport['mode'] = 'quick';
  let startTime = Date.now();

  for (const line of lines) {
    // 检查开始
    const checkStartMatch = line.match(PATTERNS.checkStart);
    if (checkStartMatch) {
      // 保存前一个检查
      if (currentCheck) {
        results.push(currentCheck);
      }

      // 开始新检查
      currentCheck = {
        name: checkStartMatch[1].trim(),
        type: 'pass',
        issues: [],
        duration: 0,
      };
      continue;
    }

    // 如果当前没有活动的检查，继续扫描
    if (!currentCheck) {
      // 检测项目类型
      const projectTypeMatch = line.match(PATTERNS.projectType);
      if (projectTypeMatch) {
        projectType = parseProjectTypes(projectTypeMatch[1]);
        continue;
      }

      // 检测检查模式
      const modeMatch = line.match(PATTERNS.checkMode);
      if (modeMatch) {
        mode = parseMode(modeMatch[1]);
        continue;
      }

      continue;
    }

    // 在检查内部
    // 通过
    if (line.match(PATTERNS.pass)) {
      currentCheck.type = 'pass';
      continue;
    }

    // 失败
    if (line.match(PATTERNS.fail)) {
      currentCheck.type = 'fail';
      // 创建问题条目
      const failMatch = line.match(/❌\s+失败[::]\s+(.+)/);
      if (failMatch) {
        currentCheck.issues.push({
          ruleId: currentCheck.name.split(' ')[0] || 'UNKNOWN',
          severity: 'HIGH',
          message: failMatch[1].trim(),
          file: '',
        });
      }
      continue;
    }

    // 警告
    if (line.match(PATTERNS.warn)) {
      currentCheck.type = 'warn';
      // 创建问题条目
      const warnMatch = line.match(/⚠️\s+警告[::]\s+(.+)/);
      if (warnMatch) {
        currentCheck.issues.push({
          ruleId: currentCheck.name.split(' ')[0] || 'UNKNOWN',
          severity: 'MEDIUM',
          message: warnMatch[1].trim(),
          file: '',
        });
      }
      continue;
    }

    // 跳过
    if (line.match(PATTERNS.skip)) {
      currentCheck.type = 'skip';
      continue;
    }

    // 错误
    const errorMatch = line.match(PATTERNS.error);
    if (errorMatch) {
      currentCheck.error = errorMatch[1];
      continue;
    }

    // 文件位置
    const fileMatch = line.match(PATTERNS.fileLocation);
    if (fileMatch && currentCheck.issues.length > 0) {
      // 如果已经有文件信息，创建新的问题条目
      const lastIssue = currentCheck.issues[currentCheck.issues.length - 1];
      if (lastIssue && lastIssue.file && (lastIssue.file !== fileMatch[1] || lastIssue.line?.toString() !== fileMatch[2])) {
        // 新的文件位置，创建新问题
        currentCheck.issues.push({
          ruleId: lastIssue.ruleId,
          severity: lastIssue.severity,
          message: lastIssue.message,
          file: fileMatch[1],
          line: fileMatch[2] ? parseInt(fileMatch[2], 10) : undefined,
          suggestion: lastIssue.suggestion,
        });
      } else if (lastIssue) {
        // 同一个问题，更新文件信息
        lastIssue.file = fileMatch[1];
        if (fileMatch[2]) {
          lastIssue.line = parseInt(fileMatch[2], 10);
        }
      }
      continue;
    }

    // 建议
    const suggestionMatch = line.match(PATTERNS.suggestion);
    if (suggestionMatch && currentCheck.issues.length > 0) {
      const lastIssue = currentCheck.issues[currentCheck.issues.length - 1];
      lastIssue.suggestion = suggestionMatch[1];
      continue;
    }
  }

  // 保存最后一个检查
  if (currentCheck) {
    results.push(currentCheck);
  }

  const endTime = Date.now();

  return {
    projectRoot: process.cwd(),
    projectType,
    mode,
    timestamp: new Date(startTime).toISOString(),
    duration: endTime - startTime,
    results,
    summary: calculateSummary(results),
    isSuccess: results.every(r => r.type === 'pass' || r.type === 'skip'),
  };
}

/**
 * 解析项目类型字符串
 */
function parseProjectTypes(text: string): ProjectType[] {
  const types: ProjectType[] = [];
  const lower = text.toLowerCase();

  if (lower.includes('python')) types.push('python');
  if (lower.includes('typescript') || lower.includes('ts')) types.push('typescript');
  if (lower.includes('javascript') || lower.includes('js')) types.push('javascript');
  if (lower.includes('go')) types.push('go');
  if (lower.includes('rust')) types.push('rust');

  return types.length > 0 ? types : ['unknown'];
}

/**
 * 解析检查模式
 */
function parseMode(text: string): MoatReport['mode'] {
  if (text.includes('full')) return 'full';
  if (text.includes('legacy')) return 'legacy';
  return 'quick';
}

/**
 * 计算汇总统计
 */
function calculateSummary(results: MoatCheckResult[]) {
  const summary = {
    total: results.length,
    passed: 0,
    failed: 0,
    warnings: 0,
    skipped: 0,
  };

  for (const result of results) {
    if (result.type === 'pass') summary.passed++;
    else if (result.type === 'fail') summary.failed++;
    else if (result.type === 'warn') summary.warnings++;
    else if (result.type === 'skip') summary.skipped++;
  }

  return summary;
}
