// preflop handstrength calculation
// WARN: this scripts takes long execution time. ~120min.
//
// For more details, see https://qiita.com/41semicolon/items/c5a33e516999d5108cda

const { handval, deck } = require('../src/index.js');
const { hparse, HCARDNAMES } = require('../src/hcard.js');

const simulate = (hname, nPlayer, nSample) => {
  const hcards = hparse(hname);
  let counter = 0;
  for (let i = 0; i < nSample; i += 1) { // XXX: really big loop. performance over cleaness
    const dk = deck().filter(c => !hcards.includes(c));
    const myval = handval([hcards[0], hcards[1], dk[0], dk[1], dk[2], dk[3], dk[4]]);
    let winFlag = true; // to be false when any one of opponents wins
    for (let p = 0; p < nPlayer - 1; p += 1) { // nPlayer includes me, so opponents' # is nPlayer -1.
      const ophandval = handval([dk[0], dk[1], dk[2], dk[3], dk[4], dk[5+2*p], dk[6+2*p]]);
      if (ophandval < myval) {
        winFlag = false;
        break;
      }
    }
    if (winFlag) counter += 1;
  }
  return counter / nSample * 100.0;
};

for (const nPlayer of [2, 3, 4, 5, 6, 7, 8, 9]) {
  const stats = {};
  for (const name of HCARDNAMES) {
    stats[name] = simulate(name, nPlayer, 10000);
  }
  console.log(JSON.stringify(stats));
}
