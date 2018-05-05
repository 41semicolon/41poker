const { potmake } = require('../src/pot.js');

test('potmake', () => {

  let p = [0];
  let c = [[]];
  let b = [10, 10, 10];
  expect(potmake(p, c, b))
    .toEqual([[30], [[0, 1, 2]]]);

  p = [0];
  c = [[]];
  b = [10, 10, 30];
  expect(potmake(p, c, b))
    .toEqual([[30, 20], [[0, 1, 2], [2]]]);

  p = [0];
  c = [[]];
  b = [10, 20, 30];
  expect(potmake(p, c, b))
    .toEqual([[30, 20, 10], [[0, 1, 2], [1, 2], [2]]]);

  p = [20];
  c = [[0, 1, 2]];
  b = [10, 10, 30];
  expect(potmake(p, c, b))
    .toEqual([[50, 20], [[0, 1, 2], [2]]])

});
