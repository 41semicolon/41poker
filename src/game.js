const { range, shuffle } = require('./util.js');

const deck = () => shuffle(range(52));

// XXX: pot has to include opponents' bet
// i.e. pot must be 100+30*2 when two other opponents already bet/call 30.
const potodds = (pot, bet) => (pot + bet) / bet;
const ev = (hsval, pot, bet) => hsval * (pot + bet);

module.exports = { deck, ev, potodds };
