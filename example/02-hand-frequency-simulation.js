// calculate hand frequency by simulation.
// this reproduces the work of https://en.wikipedia.org/wiki/Poker_probability

/* output:

hand frequency (5 cards) out of 10000000 samples
===============================================
0.00% 166 straight flush
0.02% 2466 four of a kind
0.14% 14470 full house
0.20% 19554 flush
0.39% 39317 straight
2.12% 212041 three of a kind
4.75% 475172 two pairs
42.24% 4223707 one pair
50.13% 5013107 high card

hand frequency (7 cards) out of 10000000 samples
===============================================
0.03% 2996 straight flush
0.17% 16876 four of a kind
2.59% 258933 full house
3.02% 302188 flush
4.63% 462824 straight
4.83% 482577 three of a kind
23.50% 2350086 two pairs
43.81% 4381343 one pair
17.42% 1742177 high card
*/

const { deck, handval, handname } = require('../src/index.js');

const rankfreqSimulation = (cardnum, nSample) => {
  // 1. do simulation
  const stats = Array(7462 + 1).fill(0); // + 1 means stats[val] represents val of stats.
  for (let i = 0; i < nSample; i += 1) {
    const hand = deck().slice(0, cardnum);
    const value = handval(hand);
    if (value > 7462) throw Error('something wrong');
    stats[value] += 1;
  }
  // 2. group by hand name
  const handstats = {};
  stats
    .map((freq, val) => [handname(val), freq])
    .map(([name, freq]) => {
      if (handstats[name]) handstats[name] += freq;
      else handstats[name] = freq;
    });
  // 3. normalize and print out
  console.log(`hand frequency (${cardnum} cards) out of ${nSample} samples`);
  console.log('===============================================');
  Object.entries(handstats)
    .map(([name, freq]) => [name, freq, (freq / nSample * 100.0).toFixed(2) + '%'])
    .map(([name, freq, prob]) => { console.log(prob, freq, name) });
};

rankfreqSimulation(5, 10000000);
console.log();
rankfreqSimulation(7, 10000000);
