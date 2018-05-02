/* eslint no-mixed-operators: 'off' */

const { handval, handval7 } = require('./handval.js');
const { range, forEachCombinationApply } = require('./util.js');

const STRAIGHT_FLUSH = 0;
const FOUR_OF_A_KIND = 1;
const FULL_HOUSE = 2;
const FLUSH = 3;
const STRAIGHT = 4;
const THREE_OF_A_KIND = 5;
const TWO_PAIR = 6;
const ONE_PAIR = 7;
const HIGH_CARD = 8;

const handcode = (val) => {
  if (val > 6185) return HIGH_CARD;
  if (val > 3325) return ONE_PAIR;
  if (val > 2467) return TWO_PAIR;
  if (val > 1609) return THREE_OF_A_KIND;
  if (val > 1599) return STRAIGHT;
  if (val > 322) return FLUSH;
  if (val > 166) return FULL_HOUSE;
  if (val > 10) return FOUR_OF_A_KIND;
  return STRAIGHT_FLUSH;
};

const handname = (val) => {
  if (val > 6185) return 'high card';
  if (val > 3325) return 'one pair';
  if (val > 2467) return 'two pairs';
  if (val > 1609) return 'three of a kind';
  if (val > 1599) return 'straight';
  if (val > 322) return 'flush';
  if (val > 166) return 'full house';
  if (val > 10) return 'four of a kind';
  return 'straight flush';
};

const handmeterTV = (board, hands) => {
  // 1. setup deck
  let deck = range(52).filter(c => !board.includes(c));
  hands.map((hand) => { deck = deck.filter(c => !hand.includes(c)); return null; });
  // 2. for all possible cases, check who is the winner and update stat.
  const counter = hands.map(() => 0);
  forEachCombinationApply(
    (cards) => {
      const values = hands.map(h => [...board, ...cards, ...h]).map(handval7);
      const winval = values.reduce((acc, x) => (acc > x ? x : acc), 9999);
      values.forEach((val, i) => { if (val === winval) counter[i] += 1; });
    },
    5 - board.length, // number of cards to draw from deck
    deck,
  );
  // 3. normalize stats
  const sum = counter.reduce((acc, x) => acc + x, 0);
  return counter.map(x => x / sum * 100.0);
};

module.exports = {
  handval,
  handcode,
  handname,
  handmeterTV,
};
