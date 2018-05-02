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

```
const P = require('./src/index.js'); // will be replaced by const P = require('41poker') when published to npm;
```

deal 7 cards and evaluate it.

```js
const myhand = P.deck().slice(0,7)
const value = P.handval(myhand);
const name = P.handname(value);

console.log(myhand, value, name)
// -> [ 28, 36, 45, 49, 44, 4, 5 ] 2699 'two pairs'
```


## Thanks

* [HenryRLee/PokerHandEvaluator](https://github.com/HenryRLee/PokerHandEvaluator/) for an efficient poker hand evaluation algorithm.

## License

MIT
