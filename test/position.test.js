const game = require('../src/rule/index.js');

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

