# 41poker

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

## Basic Usage

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

## Articles

some contents are avaialbel in Japanese.

- [ハンドメータを作る](https://qiita.com/41semicolon/items/4734c9b082c9e1964f1c)
- [ホールデムポーカのプリフロップ戦略と可視化](https://qiita.com/41semicolon/items/c5a33e516999d5108cda)


## Thanks

* [HenryRLee/PokerHandEvaluator](https://github.com/HenryRLee/PokerHandEvaluator/) for an efficient poker hand evaluation algorithm.

## License

MIT
