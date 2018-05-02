const { card } = require('../src/card.js');
const {
  hrepr,
  hparse,
  hsPreflop,
  HCARDNAMES,
} = require('../src/hcard.js');

test('check hrepr()', () => {
  expect(hrepr([card(11, 0), card(11, 1)])).toBe('KK');
  expect(hrepr([card(11, 0), card(12, 1)])).toBe('AKo');
  expect(hrepr([card(11, 0), card(12, 0)])).toBe('AKs');
  expect(hrepr([card(1, 0), card(8, 0)])).toBe('T3s');
});

test('check hparse()', () => {
  expect(hparse('AA')).toEqual([card(12, 0), card(12, 1)]);
  expect(hparse('AKs')).toEqual([card(12, 0), card(11, 0)]);
  expect(hparse('AKo')).toEqual([card(12, 0), card(11, 1)]);

  expect(hparse('33')).toEqual([card(1, 0), card(1, 1)]);
  expect(hparse('34s')).toEqual([card(1, 0), card(2, 0)]);
  expect(hparse('34o')).toEqual([card(1, 0), card(2, 1)]);
});

test('check HCARDNAMES', () => {
  expect(HCARDNAMES.length).toBe(13 * 13);
  expect(HCARDNAMES.includes('AA')).toBe(true);
  expect(HCARDNAMES.includes('22')).toBe(true);
  expect(HCARDNAMES.includes('AKs')).toBe(true);
  expect(HCARDNAMES.includes('AKo')).toBe(true);
  expect(HCARDNAMES.includes('T2o')).toBe(true);
});

test('check hsPreflop', () => {
  expect(hsPreflop(2, [51, 50])).toBeCloseTo(85.5, 0);
  expect(hsPreflop(3, [51, 50])).toBeCloseTo(73.8, 0);
  expect(hsPreflop(4, [51, 50])).toBeCloseTo(64.2, 0);
  expect(hsPreflop(5, [51, 50])).toBeCloseTo(56.2, 0);
});

