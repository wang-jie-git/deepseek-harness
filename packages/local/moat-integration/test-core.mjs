#!/usr/bin/env node

/**
 * 🧪 Moat Integration 核心功能测试
 * 测试 Moat 客户端和解析器（不依赖 DSH 编译）
 */

import { parseMoatOutput } from './src/moat-parser.ts';
import { MoatClient, formatReport, quickCheck } from './src/moat-client.ts';

async function test1_Parser() {
  console.log('🧪 测试 1: Moat 输出解析器\n');

  const sampleOutput = `
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

📊 检查结果: 通过 2, 失败 0, 警告 1, 跳过 0, 耗时 0.85s
`;

  const report = parseMoatOutput(sampleOutput);

  console.log('✅ 解析结果:');
  console.log(`   项目类型: ${report.projectType.join(', ')}`);
  console.log(`   检查模式: ${report.mode}`);
  console.log(`   汇总统计: 通过 ${report.summary.passed} | 失败 ${report.summary.failed} | 警告 ${report.summary.warnings}`);
  console.log(`   检查通过: ${report.isSuccess}`);
  console.log(`   检查项数: ${report.results.length}`);
  console.log('');

  // 验证
  if (report.projectType.length === 0) {
    throw new Error('❌ 项目类型解析失败');
  }
  if (report.summary.warnings !== 1) {
    throw new Error('❌ 警告数解析错误');
  }

  return report;
}

async function test2_RealMoatCheck() {
  console.log('🛡️  测试 2: 真实 Moat 检查\n');

  try {
    const report = await quickCheck();

    console.log(formatReport(report));

    // 验证
    if (!report.summary) {
      throw new Error('❌ 缺少 summary');
    }
    if (typeof report.isSuccess !== 'boolean') {
      throw new Error('❌ isSuccess 不是 boolean');
    }

    console.log('\n✅ Moat 检查成功');
    return report;
  } catch (error) {
    console.error('❌ Moat 检查失败:', error);
    throw error;
  }
}

async function test3_ClientAvailability() {
  console.log('\n🔍 测试 3: Moat 客户端可用性\n');

  const client = new MoatClient();
  const available = await client.checkAvailability();

  console.log(`Moat 可用: ${available ? '✅ 是' : '❌ 否'}`);

  if (!available) {
    throw new Error('Moat 不可用');
  }

  return available;
}

async function main() {
  console.log('🚀 Moat Integration 核心功能测试\n');
  console.log('='.repeat(50));
  console.log('');

  try {
    await test1_Parser();
    await test2_RealMoatCheck();
    await test3_ClientAvailability();

    console.log('\n' + '='.repeat(50));
    console.log('✅ 所有测试通过！');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

main();
