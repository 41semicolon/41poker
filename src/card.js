/* eslint no-bitwise: 'off' */
const card = (rank, suit) => (suit | (rank << 2));

// single card stuff
const rankRepr = (num) => {
  switch (num >> 2) {
    case 12: return 'A';
    case 11: return 'K';
    case 10: return 'Q';
    case 9: return 'J';
    case 8: return 'T';
    default: return (num >> 2) + 2;
  }
};

const repr = (num) => {
  let suitStr;
  switch (num & 0b11) {
    case 0: suitStr = '♥'; break;
    case 1: suitStr = '♦'; break;
    case 2: suitStr = '♣'; break;
    case 3: suitStr = '♠'; break;
    default:
  }
  return `${rankRepr(num)}${suitStr}`;
};
const parse = (str) => {
  let rank;
  switch (str[0]) {
    case 'A': rank = 12; break;
    case 'K': rank = 11; break;
    case 'Q': rank = 10; break;
    case 'J': rank = 9; break;
    case 'T': rank = 8; break;
    default: rank = parseInt(str[0], 10) - 2;
  }
  let suit;
  switch (str[1]) {
    case '♥':
    case 'h':
    case 'H': suit = 0; break;
    case '♦':
    case 'd':
    case 'D': suit = 1; break;
    case '♣':
    case 'c':
    case 'C': suit = 2; break;
    case '♠':
    case 's':
    case 'S': suit = 3; break;
    default:
  }
  return card(rank, suit);
};

// hole cards stuff

const hrepr = (cards) => { // cards -> AA, AKs, ...
  const work = [...cards];
  work.sort((x, y) => (x >> 2) - (y >> 2)).reverse();
  const rletter = work.map(rankRepr).join('');
  const sletter = ((work[0] & 0b11) === (work[1] & 0b11)) ? 's' : 'o';
  if ((work[0] >> 2) === (work[1] >> 2)) {
    return rletter; // returns AA, not AAo
  }
  return `${rletter}${sletter}`;
};

const hparse = (str) => { // AKo -> hand,
  if (str.length === 2) { // pockets
    return [parse(`${str[0]}H`), parse(`${str[1]}D`)];
  }
  switch (str[2]) {
    case 's': return [parse(`${str[0]}H`), parse(`${str[1]}H`)];
    case 'o': return [parse(`${str[0]}H`), parse(`${str[1]}D`)];
    default: throw Error('invalid input');
  }
};

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
  card,
  repr,
  parse,
  hrepr,
  hparse,
  HCARDNAMES,
};
