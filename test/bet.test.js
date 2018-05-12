const bet = require('../src/rule/bet.js');

test('bet check', () => {
  const BB = 10;
  let hist = [];
  let amount = 1;

  // minimum bet
  expect(bet.minimum(BB, hist)).toBe(10);
  expect(bet.isValidAmount(BB, hist, amount)).toBe(false);
  amount = 10;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(true);
  amount = 20;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(true);

  // minimum raise
  hist = [10];
  amount = 1;
  expect(bet.minimum(BB, hist)).toBe(20);
  expect(bet.isValidAmount(BB, hist, amount)).toBe(false);
  amount = 10;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(false);
  amount = 20;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(true);

  // minimum reraise
  hist = [10, 30];
  amount = 1;
  expect(bet.minimum(BB, hist)).toBe(50);
  expect(bet.isValidAmount(BB, hist, amount)).toBe(false);
  amount = 30;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(false);
  amount = 49;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(false);
  amount = 50;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(true);
  amount = 60;
  expect(bet.isValidAmount(BB, hist, amount)).toBe(true);
});
