const game = require('../src/game.js');

const [t, f] = [true, false];

test('bet check', () => {
  const BB = 10;
  let hist = [];
  let amount = 1;

  // minimum bet
  expect(game.__isValidAmount(BB, hist, amount)).toBe(false);
  amount = 10;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(true);
  amount = 20;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(true);

  // minimum raise
  hist = [10];
  amount = 1;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(false);
  amount = 10;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(false);
  amount = 20;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(true);

  // minimum reraise
  hist = [10, 30];
  amount = 1;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(false);
  amount = 30;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(false);
  amount = 49;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(false);
  amount = 50;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(true);
  amount = 60;
  expect(game.__isValidAmount(BB, hist, amount)).toBe(true);


});
