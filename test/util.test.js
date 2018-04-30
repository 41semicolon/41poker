const util = require('../src/util.js');

test('check range()', () => {
  expect(util.range(52).length).toBe(52);
  expect(util.range(52).shift()).toBe(0);
  expect(util.range(52).pop()).toBe(51);
});

test('check combination()', () => {
  expect(Array.from(util.combinations(1, util.range(4))).length).toBe(4);
  expect(Array.from(util.combinations(2, util.range(3))).length).toBe(3);
  expect(Array.from(util.combinations(2, util.range(4))).length).toBe(6);
  expect(Array.from(util.combinations(2, util.range(52))).length).toBe(26 * 51);
  expect(Array.from(util.combinations(3, util.range(52))).length).toBe(26 * 17 * 50);
});


test('check forEachCombinationApply()', () => {
  let count = 0;

  // C(20, 2) = 190;
  count = 0;
  util.forEachCombinationApply(() => { count += 1; }, 2, util.range(20));
  expect(count).toBe(190);

  // C(10, 5) = 252;
  count = 0;
  util.forEachCombinationApply(() => { count += 1; }, 5, util.range(10));
  expect(count).toBe(252);

  // C(10, 7) = 120;
  count = 0;
  util.forEachCombinationApply(() => { count += 1; }, 7, util.range(10));
  expect(count).toBe(120);
});
