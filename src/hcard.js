/* eslint no-bitwise: 'off' */
/* eslint no-mixed-operators: 'off' */
const { rankrepr, parse } = require('./card.js');
const { deck } = require('./game.js');
const { HS_PREFLOP } = require('./tables/preflop-hs.js');
const { range, forEachCombinationApply, simulateN } = require('./util.js');
const { handval7 } = require('./handval.js');

// repr i.e. AA, AKs, ...
const hrepr = (cards) => {
  const work = [...cards];
  work.sort((x, y) => (x >> 2) - (y >> 2)).reverse();
  const rletter = work.map(rankrepr).join('');
  const sletter = ((work[0] & 0b11) === (work[1] & 0b11)) ? 's' : 'o';
  if ((work[0] >> 2) === (work[1] >> 2)) {
    return rletter; // returns AA, not AAo
  }
  return `${rletter}${sletter}`;
};

// parse i.e. AKo -> repsenetive hands
const hparse = (str) => {
  if (str.length === 2) { // pockets
    return [parse(`${str[0]}H`), parse(`${str[1]}D`)];
  }
  switch (str[2]) {
    case 's': return [parse(`${str[0]}H`), parse(`${str[1]}H`)];
    case 'o': return [parse(`${str[0]}H`), parse(`${str[1]}D`)];
    default: throw Error('invalid input');
  }
};

// calculates handstrength when opponents' cards are known.
// possible cases amounts to no less than C(48, 5) = 1.7M, which results in a seconds of compuatation time
const handmeterTV = (board, hands) => {
  // 1. setup deck
  let dk = range(52).filter(c => !board.includes(c));
  hands.map((hand) => { dk = dk.filter(c => !hand.includes(c)); return null; });
  // 2. for all possible cases, check who is the winner and update stat.
  const counter = hands.map(() => 0);
  forEachCombinationApply(
    (cards) => {
      const values = hands.map(h => [...board, ...cards, ...h]).map(handval7);
      const winval = values.reduce((acc, x) => (acc > x ? x : acc), 9999);
      values.forEach((val, i) => { if (val === winval) counter[i] += 1; });
    },
    5 - board.length, // number of cards to draw from deck
    dk,
  );
  // 3. normalize stats
  const sum = counter.reduce((acc, x) => acc + x, 0);
  return counter.map(x => x / sum * 100.0);
};

// hand strength(HS)
const hs = (mycards, nPlayer = 2, board = [], nSample = 10000) => {
  const stats = simulateN(nSample)(
    () => { // returns true if I win or draw
      const numDraw = 5 - board.length;
      const dk = deck().filter(x => !mycards.includes(x) && !board.includes(x));
      const allboard = [...board, ...dk.slice(0, numDraw)];
      const myvalue = handval7([...allboard, ...mycards]);
      return range(nPlayer - 1)
        .map(i => [...allboard, ...dk.slice(numDraw + 2 * i, numDraw + 2 * i + 2)])
        .map(handval7)
        .reduce((acc, x) => acc && (myvalue <= x), true);
    },
    (count, win) => (win ? count + 1 : count),
    0, // count
  );
  return stats / nSample;
};

const hsPreflop = (nPlayer, mycards) => HS_PREFLOP[nPlayer][hrepr(mycards)]; //precomputed.

const HCARDNAMES = [
  '22',
  '32o', '32s', '33',
  '42o', '42s', '43o', '43s', '44',
  '52o', '52s', '53o', '53s', '54o', '54s', '55',
  '62o', '62s', '63o', '63s', '64o', '64s', '65o', '65s', '66',
  '72o', '72s', '73o', '73s', '74o', '74s', '75o', '75s', '76o', '76s', '77',
  '82o', '82s', '83o', '83s', '84o', '84s', '85o', '85s', '86o', '86s', '87o', '87s', '88',
  '92o', '92s', '93o', '93s', '94o', '94s', '95o', '95s', '96o', '96s', '97o', '97s', '98o', '98s', '99',
  'T2o', 'T2s', 'T3o', 'T3s', 'T4o', 'T4s', 'T5o', 'T5s', 'T6o', 'T6s', 'T7o', 'T7s', 'T8o', 'T8s', 'T9o', 'T9s', 'TT',
  'J2o', 'J2s', 'J3o', 'J3s', 'J4o', 'J4s', 'J5o', 'J5s', 'J6o', 'J6s', 'J7o', 'J7s', 'J8o', 'J8s', 'J9o', 'J9s', 'JJ', 'JTo', 'JTs',
  'Q2o', 'Q2s', 'Q3o', 'Q3s', 'Q4o', 'Q4s', 'Q5o', 'Q5s', 'Q6o', 'Q6s', 'Q7o', 'Q7s', 'Q8o', 'Q8s', 'Q9o', 'Q9s', 'QJo', 'QJs', 'QQ', 'QTo', 'QTs',
  'K2o', 'K2s', 'K3o', 'K3s', 'K4o', 'K4s', 'K5o', 'K5s', 'K6o', 'K6s', 'K7o', 'K7s', 'K8o', 'K8s', 'K9o', 'K9s', 'KJo', 'KJs', 'KK', 'KQo', 'KQs', 'KTo', 'KTs',
  'A2o', 'A2s', 'A3o', 'A3s', 'A4o', 'A4s', 'A5o', 'A5s', 'A6o', 'A6s', 'A7o', 'A7s', 'A8o', 'A8s', 'A9o', 'A9s', 'AA', 'AJo', 'AJs', 'AKo', 'AKs', 'AQo', 'AQs', 'ATo', 'ATs',
];

module.exports = {
  hrepr,
  hparse,
  handmeterTV,
  hs,
  hsPreflop,
  HCARDNAMES,
};
