import { describe, expect, it } from 'vitest';
import { evaluateExperiment, variantGroups, wilson, type Group } from '@/lib/stats-model';
import { ACTIVE_EXPERIMENT, EXPERIMENT_RULES, EXPERIMENT_VARIANT_COUNT } from '@/config/site';

const rules = { minVisitsPerVariant: 100 };
const group = (key: string, visits: number, outbound: number): Group => {
  const [low, high] = wilson(outbound, visits);
  return { key, visits, clicks: 0, outbound, low, high };
};

describe('Automatic variant promotion', () => {
  it('waits until every variant reaches the minimum sample', () => {
    const rows = [group('ctaplace-0', 300, 90), group('ctaplace-1', 300, 30), group('ctaplace-2', 300, 27), group('ctaplace-3', 60, 6)];
    const decision = evaluateExperiment(rows, 'ctaplace', rules);
    expect(decision.status).toBe('insufficient');
    expect(decision.reason).toContain('60');
  });

  it('keeps testing while the lead is inside the uncertainty range', () => {
    const rows = [group('ctaplace-0', 300, 60), group('ctaplace-1', 300, 52), group('ctaplace-2', 300, 45), group('ctaplace-3', 300, 40)];
    expect(evaluateExperiment(rows, 'ctaplace', rules).status).toBe('unclear');
  });

  it('promotes only a clear leader with a full sample', () => {
    const rows = [group('ctaplace-0', 300, 90), group('ctaplace-1', 300, 30), group('ctaplace-2', 300, 27), group('ctaplace-3', 300, 24)];
    expect(evaluateExperiment(rows, 'ctaplace', rules)).toMatchObject({ status: 'promoted', winner: 'ctaplace-0' });
  });

  it('ignores variants from another experiment', () => {
    const rows = [group('headline-0', 300, 90), group('headline-1', 300, 30)];
    expect(evaluateExperiment(rows, 'ctaplace', rules).status).toBe('insufficient');
  });

  it('builds report groups from server counts', () => {
    const [only] = variantGroups([{ variant_id: 'ctaplace-1', visits: '200', outbound: '20' }]);
    expect(only).toMatchObject({ key: 'ctaplace-1', visits: 200, outbound: 20 });
    expect(only.high).toBeGreaterThan(only.low);
  });

  it('uses the configured threshold and variant count', () => {
    expect(EXPERIMENT_RULES.minVisitsPerVariant).toBe(100);
    expect(EXPERIMENT_VARIANT_COUNT[ACTIVE_EXPERIMENT]).toBe(4);
  });
});
