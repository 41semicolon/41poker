// find balanced hand.
// for more infomation, see: https://qiita.com/41semicolon/items/054aa693b9745ec8fd50

/* output

*/
/* eslint no-mixed-operators: 'off' */
const _ = require('lodash');
const { deck, handval } = require('../src/index.js');
const { lookup } = require('./7462.js');

const valOfwinner = hands => hands.reduce((acc, h) => (acc < handval(h) ? acc : handval(h)), 9999);

const generateAccum = (nPlayer, numTry) => {
  const freq = Array(7462 + 1).fill(0); // freq[val] to represent val of stats, which requires one extra space
  for (let i = 0; i < numTry; i += 1) {
    const mydeck = deck();
    const board = mydeck.slice(0, 5);
    const hands = _.range(nPlayer).map(x => [...board, ...mydeck.slice(5 + 2 * x, 7 + 2 * x)]);
    freq[valOfwinner(hands)] += 1;
  }
  // generate acc. function. XXX: accumulate from 7462 to 1, that is reversed order.
  const accFreq = freq.map((val, i) => [i, val]).reverse().reduce(
    (acc, [val, num]) => { acc.push([val, num + acc[acc.length - 1][1]]); return acc; },
    [[9999, 0]],
  );
  const accNorm = accFreq.map(([val, num]) => [val, num / numTry]);
  // find balanced hand
  const balanced = accNorm.filter(x => x[1] > 1.0 / nPlayer).shift();
  console.log(`${nPlayer}players: balanced at`, balanced[0], lookup[balanced[0]][5]);
  return accNorm;
};

generateAccum(2, 100000);
generateAccum(3, 100000);
generateAccum(4, 100000);
generateAccum(5, 100000);
generateAccum(6, 100000);
generateAccum(7, 100000);
generateAccum(8, 100000);
generateAccum(9, 100000);

