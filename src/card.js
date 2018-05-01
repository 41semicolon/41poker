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

module.exports = {
  card,
  repr,
  parse,
  hrepr,
  hparse,
};
