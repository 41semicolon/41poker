const { card } = require('../src/card.js');
const { handval } = require('../src/handval.js');

test('handvalue', () => {
  let val;
  val = handval([card(12, 0), card(11, 0), card(10, 0), card(9, 0), card(8, 0), card(7, 1), card(6, 2)]);
  expect(val).toBe(1);

  val = handval([card(11, 0), card(10, 0), card(9, 0), card(8, 0), card(7, 0), card(6, 1), card(5, 2)]);
  expect(val).toBe(2);

  // these hands are reffred in http://suffe.cool/poker/evaluator.html
  val = handval([card(12, 0), card(11, 0), card(10, 0), card(9, 0), card(7, 0), card(6, 0), card(5, 0)]);
  expect(val).toBe(323);

  val = handval([card(11, 0), card(10, 1), card(9, 2), card(8, 3), card(7, 0), card(6, 1), card(5, 2)]);
  expect(val).toBe(1601);
});
