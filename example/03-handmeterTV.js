// calculate handmeter TV show offers.
//
// output:
// Hands   [ 'K♥ Q♥', 'Q♦ T♣' ]
// preflop [ '74%', '26%' ]
// flop    [ '84%', '16%' ] Borad: [ 'A♦', '4♠', '8♣' ]
// turn    [ '93%', '7%'  ] Board: [ 'A♦', '4♠', '8♣', '5♦' ]

const { card, repr } = require('../src/index.js');
const { handmeterTV } = require('../src/hcard.js');

const hands = [[card(11, 0), card(10, 0)], [card(10, 1), card(8, 2)]];
const board3 = [card(12, 1), card(2, 3), card(6, 2)];
const board4 = [card(12, 1), card(2, 3), card(6, 2), card(3, 1)];

console.log('Hands  ', hands.map(h => h.map(repr).join(' ')));
console.log('preflop', handmeterTV([], hands).map(x => `${x.toFixed(0)}%`));
console.log('flop   ', handmeterTV(board3, hands).map(x => `${x.toFixed(0)}%`), 'Borad:', board3.map(repr));
console.log('turn   ', handmeterTV(board4, hands).map(x => `${x.toFixed(0)}%`), 'Board:', board4.map(repr));

