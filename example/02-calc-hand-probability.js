// calculate exact probability of hand by its name.
/* output after 40 secs execution.

5 cards probability out of 2598960 caces
===============================================
0.00% 40 straight flush
0.02% 624 four of a kind
0.14% 3744 full house
0.20% 5108 flush
0.39% 10200 straight
2.11% 54912 three of a kind
4.75% 123552 two pairs
42.26% 1098240 one pair
50.12% 1302540 high card

7 cards probability out of 133784560 caces
===============================================
0.03% 41584 straight flush
0.17% 224848 four of a kind
2.60% 3473184 full house
3.03% 4047644 flush
4.62% 6180020 straight
4.83% 6461620 three of a kind
23.50% 31433400 two pairs
43.82% 58627800 one pair
17.41% 23294460 high card

*/

const assert = require('assert');
const { range, forEachCombinationApply } = require('../src/util.js');
const { handval, handrepr } = require('../src/hand.js');

const stats = Array(7462 + 1).fill(0); // + 1 means stats[val] represents val of stats.
forEachCombinationApply(
  (cards) => {
    const val = handval(cards);
    if (val > 7462) throw Error('something wrong');
    stats[val] += 1;
  },
  5,
  range(52),
);
assert(stats.reduce((acc, x) => acc + x, 0) === 2598960);

// group by hand name
const handstats = {};
stats.map((freq, val) => [handrepr(val), freq])
  .map(([name, freq]) => {
    if (handstats[name]) handstats[name] += freq;
    else handstats[name] = freq;
  });

// normalize and print out
console.log('5 cards probability out of 2598960 caces');
console.log('===============================================');
Object.entries(handstats)
  .map(([name, freq]) => [name, freq, (freq / 2598960.0 * 100.0).toFixed(2) + '%'])
  .map(([name, freq, prob]) => { console.log(prob, freq, name) });

// 7 cards
const stats7 = Array(7462 + 1).fill(0); // + 1 means stats[val] represents val of stats.
forEachCombinationApply(
  (cards) => {
    const val = handval(cards);
    if (val > 7462) throw Error('something wrong');
    stats7[val] += 1;
  },
  7,
  range(52),
);
assert(stats7.reduce((acc, x) => acc + x, 0) === 133784560);

// group by hand name
const handstats7 = {};
stats7.map((freq, val) => [handrepr(val), freq])
  .map(([name, freq]) => {
    if (handstats7[name]) handstats7[name] += freq;
    else handstats7[name] = freq;
  });

// normalize and print out
console.log('7 cards probability out of 133784560 caces');
console.log('===============================================');
Object.entries(handstats7)
  .map(([name, freq]) => [name, freq, (freq / 133784560.0 * 100.0).toFixed(2) + '%'])
  .map(([name, freq, prob]) => { console.log(prob, freq, name) });

