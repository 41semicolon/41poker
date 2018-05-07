const { deck } = require('../src/game.js');
const { onegame } = require('../src/dealer.js');
const { human } = require('./human-console.js');

const show = (state) => {
  const { deck: _, SB, players, nextBTN, ...rest } = state;
  console.log(JSON.stringify(rest));
};

let state = {
  deck: deck(),
  players: ['dull', 'dull', 'dull', 'human', 'dull', 'dull'],
  stacks: [100, 100, 100, 300, 100, 100],
  lastBB: 0,
  SB: 1,
};

(async () => {
  for (let i = 0; i < 3; i += 1) {
    state = { ...(await onegame(human)(state)), deck: deck() };
    if (i % 99 === 0) show(state);
  }
})();
