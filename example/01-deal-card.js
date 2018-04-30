// calculate hand value for random 7 cards
//
// output:
// 6♣ K♠ 3♣ J♠ 7♣ A♠ 5♦ high card(6251)
// Q♣ 5♣ T♠ Q♦ 3♥ 6♦ 9♣ one pair(3904)
// 3♦ 2♦ 2♠ 2♣ 3♠ 3♥ 4♣ full house(310)
// Q♣ 4♠ Q♦ 5♠ 8♦ 9♦ 7♥ one pair(3930)
// 6♠ 8♥ 4♥ 2♥ 6♣ 5♠ 3♠ straight(1608)
// A♥ K♦ 7♣ T♣ J♠ 5♠ 5♥ one pair(5307)
// Q♦ Q♣ 5♠ A♥ 4♦ 8♥ J♦ one pair(3778)
// J♥ 4♣ 8♥ A♦ 9♥ T♣ 4♠ one pair(5545)
// Q♥ Q♠ 2♥ 9♣ 8♥ 3♣ A♠ one pair(3793)
// 7♦ 4♥ 9♠ 7♣ J♣ 4♦ J♥ two pairs(2868)

const { getdeck } = require('../src/game.js');
const { repr } = require('../src/card.js');
const { handval, handrepr } = require('../src/hand.js');

for (let i = 0; i < 10; i += 1) {
  const hand = getdeck().slice(0, 7);
  console.log(`${hand.map(repr).join(' ')} ${handrepr(hand)}(${handval(hand)})`);
}
