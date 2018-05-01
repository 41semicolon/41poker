const {
  card,
  repr,
  parse,
  hrepr,
  hparse,
  HCARDNAMES,
} = require('../src/card.js');

test('check card()', () => {
  expect(card(0, 0)).toBe(0);
  expect(card(0, 1)).toBe(1);
  expect(card(1, 0)).toBe(4);
  expect(card(1, 1)).toBe(5);
  expect(card(12, 2)).toBe(50);
  expect(card(12, 3)).toBe(51);
});

test('check repr()', () => {
  expect(repr(0)).toBe('2♥');
  expect(repr(1)).toBe('2♦');
  expect(repr(51)).toBe('A♠');
});

test('check parse()', () => {
  expect(parse('2♥')).toBe(0);
  expect(parse('2H')).toBe(0);
  expect(parse('2h')).toBe(0);
  expect(parse('A♠')).toBe(51);
  expect(parse('As')).toBe(51);
  expect(parse('AS')).toBe(51);
});

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

