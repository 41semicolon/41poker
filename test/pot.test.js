const { potmake, shares } = require('../src/pot.js');

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


test('share', () => {
  let vals = [3, 10, 20, 20, 40];
  let p= [30];
  let c= [[0, 1, 2, 3, 4, 5]];
  let SB = 2;
  let res = shares(vals, p, c, SB);
  expect(res).toEqual([30, 0, 0, 0, 0]); // strongest wins

  c = [[0, 1, 2]]
  res = shares(vals, p, c, SB);
  expect(res).toEqual([30, 0, 0, 0, 0]); // strongest wins

  c = [[1, 2, 4]]
  res = shares(vals, p, c, SB);
  expect(res).toEqual([0, 30, 0, 0, 0]); // strongest in survivors wins

  c = [[2, 3, 4]]
  res = shares(vals, p, c, SB);
  expect(res).toEqual([0, 0, 15, 15, 0]); // draw, split pot

  c = [[2, 3, 4]]
  p = [15]
  res = shares(vals, p, c, SB);
  expect(res).toEqual([0, 0, 8, 7, 0]); // draw, split pot + change.

  p = [100, 10];
  c = [[0, 1, 2], [0, 1]];
  vals = [1000, 2000, 3000];
  res = shares(vals, p, c, SB);
  expect(res).toEqual([110, 0, 0]); // sidepot.

  vals = [3000, 2000, 1000]; // winners of each pot differ.
  res = shares(vals, p, c, SB);
  expect(res).toEqual([0, 10, 100]);

});
