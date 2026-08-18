import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MoatClient, quickCheck, fullCheck, formatReport } from '../src/moat-client.js';
describe('Moat Client', () => {
    describe('checkAvailability', () => {
        it('应该检测到 Moat', async () => {
            const client = new MoatClient('moat');
            const available = await client.checkAvailability();
            // 在 CI 环境中可能不可用，但不应抛出异常
            expect(typeof available).toBe('boolean');
        });
        it('应该处理无效的 Moat 路径', async () => {
            const client = new MoatClient('nonexistent-moat-command');
            const available = await client.checkAvailability();
            expect(available).toBe(false);
        });
    });
    describe('formatReport', () => {
        it('应该格式化成功报告', () => {
            const report = {
                projectRoot: '/test',
                projectType: ['python', 'typescript'],
                mode: 'quick',
                timestamp: new Date().toISOString(),
                duration: 850,
                results: [
                    {
                        name: 'SECRETS-001',
                        type: 'pass',
                        issues: [],
                        duration: 120,
                    },
                ],
                summary: {
                    total: 1,
                    passed: 1,
                    failed: 0,
                    warnings: 0,
                    skipped: 0,
                },
                isSuccess: true,
            };
            const formatted = formatReport(report);
            expect(formatted).toContain('Moat 代码质量检查报告');
            expect(formatted).toContain('通过 1');
            expect(formatted).toContain('检查通过');
        });
        it('应该格式化失败报告', () => {
            const report = {
                projectRoot: '/test',
                projectType: ['python'],
                mode: 'quick',
                timestamp: new Date().toISOString(),
                duration: 500,
                results: [
                    {
                        name: 'SECRETS-001',
                        type: 'fail',
                        issues: [
                            {
                                ruleId: 'SECRETS-001',
                                severity: 'CRITICAL',
                                message: '发现硬编码密钥',
                                file: 'config.py',
                                line: 15,
                                suggestion: '使用环境变量',
                            },
                        ],
                        duration: 500,
                    },
                ],
                summary: {
                    total: 1,
                    passed: 0,
                    failed: 1,
                    warnings: 0,
                    skipped: 0,
                },
                isSuccess: false,
            };
            const formatted = formatReport(report);
            expect(formatted).toContain('发现 1 个问题需要修复');
            expect(formatted).toContain('SECRETS-001');
            expect(formatted).toContain('config.py:15');
        });
    });
    describe('quickCheck & fullCheck', () => {
        beforeEach(() => {
            // 跳过实际调用 Moat 的测试
            vi.skipIf(!process.env.RUN_INTEGRATION_TESTS);
        });
        it('应该运行快速检查（集成测试）', async () => {
            const report = await quickCheck();
            expect(report).toHaveProperty('summary');
            expect(report).toHaveProperty('results');
            expect(report).toHaveProperty('isSuccess');
            expect(typeof report.isSuccess).toBe('boolean');
        });
        it('应该运行完整检查（集成测试）', async () => {
            const report = await fullCheck();
            expect(report).toHaveProperty('summary');
            expect(report).toHaveProperty('results');
            expect(typeof report.isSuccess).toBe('boolean');
        });
    });
});
//# sourceMappingURL=moat-client.spec.js.map