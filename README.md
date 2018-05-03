# 41poker

[![Build Status](https://travis-ci.com/41semicolon/41poker.svg?branch=master)](https://travis-ci.com/41semicolon/41poker)

41poker is a JavaScript toolset for Texas Hold'em, including

- efficient hand evaluator
- handmeter
- smart agent (to be implemented)
- console/browser gameplay (to be implemented)
- ...

Some development notes are published in Japanese at [Qiita](https://qiita.com/41semicolon).
Contact me @41semicolon at Twitter.

## Install

TBW

## Usage

import

```js
const P = require('./src/index.js');
// will be replaced by const P = require('41poker') when published to npm;
```

deal 7 cards and evaluate it.

```js
const myhand = P.deck().slice(0,7);
console.log(myhand)
// -> [ 46, 48, 13, 30, 16, 1, 4 ]

const value = P.handval(myhand);
const name = P.handname(value);
const handrepr = myhand.map(P.repr).join(' ');
console.log(handstr, name, value);
// -> K♣ A♥ 5♦ 9♣ 6♥ 2♦ 3♥ high card 6305
```

show handmeter

```js
const deck = P.deck();
const hands = [deck.slice(0, 2), deck.slice(2, 4)];
const hrepr = hands.map(([c1 ,c2]) => P.repr(c1) + P.repr(c2));
console.log(hrepr);
// -> [ '7♦A♥', '6♣2♠' ]

const preflop = P.handmeterTV([], hands).map(x => x.toFixed(2));
console.log(hrepr[0], preflop[0], hrepr[1], preflop[1]);
// -> 7♦A♥ 66.41 6♣2♠ 33.59

const flop = P.handmeterTV(deck.slice(4, 7), hands).map(x => x.toFixed(2));
console.log(hrepr[0], flop[0], hrepr[1], flop[1], deck.slice(4, 7).map(P.repr).join(''));
// -> 7♦A♥ 92.64 6♣2♠ 7.36 A♦T♠K♠

const turn = P.handmeterTV(deck.slice(4, 8), hands).map(x => x.toFixed(2));
console.log(hrepr[0], turn[0], hrepr[1], turn[1], deck.slice(4, 8).map(P.repr).join(''));
// -> 7♦A♥ 100.00 6♣2♠ 0.00 A♦T♠K♠8♣
```



## Articles

some contents are avaialbel in Japanese.

- [ハンドメータを作る](https://qiita.com/41semicolon/items/4734c9b082c9e1964f1c)
- [ホールデムポーカのプリフロップ戦略と可視化](https://qiita.com/41semicolon/items/c5a33e516999d5108cda)


## Thanks

* [HenryRLee/PokerHandEvaluator](https://github.com/HenryRLee/PokerHandEvaluator/) for an efficient poker hand evaluation algorithm.

## License

MIT
