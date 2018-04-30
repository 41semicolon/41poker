/* eslint no-bitwise: 'off' */

const card = (rank, suit) => (suit | (rank << 2));
const repr = (num) => {
  let suitStr;
  switch (num & 0b11) {
    case 0: suitStr = '♥'; break;
    case 1: suitStr = '♦'; break;
    case 2: suitStr = '♣'; break;
    case 3: suitStr = '♠'; break;
    default:
  }
  let rankStr;
  switch (num >> 2) {
    case 12: rankStr = 'A'; break;
    case 11: rankStr = 'K'; break;
    case 10: rankStr = 'Q'; break;
    case 9: rankStr = 'J'; break;
    case 8: rankStr = 'T'; break;
    default: rankStr = (num >> 2) + 2;
  }
  return `${rankStr}${suitStr}`;
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

module.exports = { card, repr, parse };
