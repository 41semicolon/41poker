/* eslint no-bitwise: 'off' */

const card = (rank, suit) => (suit | (rank << 2));

// repr
const rankrepr = (num) => {
  switch (num >> 2) {
    case 12: return 'A';
    case 11: return 'K';
    case 10: return 'Q';
    case 9: return 'J';
    case 8: return 'T';
    default: return (num >> 2) + 2;
  }
};
const suitrepr = (num) => {
  switch (num & 0b11) {
    case 0: return '♥';
    case 1: return '♦';
    case 2: return '♣';
    case 3: return '♠';
    default: return '?';
  }
};
const repr = num => `${rankrepr(num)}${suitrepr(num)}`;

// parse
const parserank = (str) => {
  switch (str[0]) {
    case 'A': return 12;
    case 'K': return 11;
    case 'Q': return 10;
    case 'J': return 9;
    case 'T': return 8;
    default: return parseInt(str[0], 10) - 2;
  }
};
const parsesuit = (str) => {
  switch (str[1]) {
    case '♥':
    case 'h':
    case 'H': return 0;
    case '♦':
    case 'd':
    case 'D': return 1;
    case '♣':
    case 'c':
    case 'C': return 2;
    case '♠':
    case 's':
    case 'S': return 3;
    default: throw Error('invalid suit');
  }
};
const parse = str => card(parserank(str), parsesuit(str));

module.exports = {
  card,
  rankrepr,
  repr,
  parse,
};
