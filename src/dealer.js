const { playerAction } = require('./bot/index.js');
const game = require('./game.js');

// create concealed info
const forNextPlayer = (state) => {
  const player = game.nextplayer(state.folded, state.betchance, state.nextPlayer);
  const { deck: _, board, hcards, ...rest } = state;
  return {
    ...rest,
    player,
    board: board.slice(0, game.numboard(state.phase)),
    hcard: hcards[player],
  };
};

const onegame = human => async (state0) => {
  let state = game.init(state0);
  for (;;) {
    // advance with global state
    state = game.reducer(state, { type: 'phasecheck', value: {} });
    if (state.finished) break;

    // advance with player action
    const info = forNextPlayer(state);
    const action = await playerAction(human, info);
    state = game.reducer(state, action);
  }
  return game.finalize(state);
};

module.exports = {
  onegame,
};

/* eslint no-await-in-loop: off */
