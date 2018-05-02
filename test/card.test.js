const {
  card,
  repr,
  parse,
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
