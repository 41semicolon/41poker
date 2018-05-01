// preflop handstrength calculation
// WARN: this scripts takes long execution time. ~120min.
//
// For more details, see https://qiita.com/41semicolon/items/c5a33e516999d5108cda

const { handval } = require('../src/hand.js');
const { hparse, HCARDNAMES } = require('../src/card.js');
const { getdeck } = require('../src/game.js');

const simulate = (hname, nPlayer, nSample) => {
  const hcards = hparse(hname);
  let counter = 0;
  for (let i = 0; i < nSample; i += 1) { // XXX: really big loop. performance over cleaness
    const deck = getdeck().filter(c => !hcards.includes(c));
    const myval = handval([hcards[0], hcards[1], deck[0], deck[1], deck[2], deck[3], deck[4]]);
    let winFlag = true; // to be false when any one of opponents wins
    for (let p = 0; p < nPlayer - 1; p += 1) { // nPlayer includes me, so opponents' # is nPlayer -1.
      const ophandval = handval([deck[0], deck[1], deck[2], deck[3], deck[4], deck[5+2*p], deck[6+2*p]]);
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
    stats[name] = simulate(name, nPlayer, 1000000);
  }
  console.log(JSON.stringify(stats));
}
