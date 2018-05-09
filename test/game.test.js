const game = require('../src/game.js');

const [t, f] = [true, false];

test('position finding', () => {
  let list = [f, f, f, f, f];
  let last = 0;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 4, posSB: 0, posBB: 1 });
  last = 1;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 0, posSB: 1, posBB: 2 });
  last = 2;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 1, posSB: 2, posBB: 3 });
  last = 3;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 2, posSB: 3, posBB: 4 });
  last = 4;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 3, posSB: 4, posBB: 0 });


  list = [f, t, t, f, f];
  last = 0;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 4, posSB: 0, posBB: 3 });
  last = 1;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 4, posSB: 0, posBB: 3 });
  last = 2;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 4, posSB: 0, posBB: 3 });
  last = 3;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 0, posSB: 3, posBB: 4 });
  last = 4;
  expect(game.positionOf(list, last))
    .toEqual({ posBTN: 3, posSB: 4, posBB: 0 });
});



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
