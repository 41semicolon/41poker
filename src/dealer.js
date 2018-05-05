const { xlog, copy } = require('./util.js');
const { handval7 } = require('./handval.js');
const { playerAction } = require('./bot/index.js');
const game = require('./game.js');

const initialize = (state0) => {
  const state = copy(state0);
  // no stack, no participate
  const folded = state.players.map((_, i) => state.stacks[i] < 2 * state.SB);
  // decide SB, BB
  const { posBB, posSB, posBTN } = game.positionOf(folded, state.lastBB);
  const betamount = state.players.map(() => 0);
  betamount[posSB] = state.SB;
  betamount[posBB] = state.SB * 2;
  const stacks = [...state.stacks];
  stacks[posSB] -= state.SB;
  stacks[posBB] -= state.SB * 2;
  return {
    ...state,
    pot: 0,
    phase: 0,
    betchance: state.players.map(() => true),
    board: state.deck.slice(0, 5),
    hcards: state.players.map((_, i) => [state.deck[5 + (2 * i)], state.deck[6 + (2 * i)]]),
    finished: false,
    nextPlayer: posBTN,
    lastBB: posBB, // update in advance,
    posBB,
    posSB,
    posBTN,
    folded,
    stacks,
    betamount,
  };
};

// create concealed info for next better
const forNextPlayer = (state) => {
  // who is next player? Most likely he/she is state.nextPlayer, but he/she might have folded
  const player = game.nextplayer(state.folded, state.betchance, state.nextPlayer);
  const { deck: _, board, hcards, ...rest } = state;
  return {
    ...rest,
    player,
    board: board.slice(0, game.numboard(state.phase)),
    hcard: hcards[player],
  };
};

// payout and cleaning state
const finalize = (state0) => {
  const state = { ...state0 };
  const allpot = state.pot + state.betamount.reduce((acc, x) => acc + x, 0);
  const result = state.folded
    .map((folded, i) => [i, folded, handval7([...state.board, ...state.hcards[i]])])
    .filter(x => !x[1]) // filter out folded players
    .sort((x, y) => x[2] - y[2]); // sort by handval
  const winners = result
    .filter(x => x[2] <= result[0][2])
    .map(x => x[0]);

  // payout to winners. Change is payout-ed to the worst position, if exists.
  let change = allpot;
  winners.forEach((i) => {
    state.stacks[i] += Math.floor(allpot / winners.length);
    change -= Math.floor(allpot / winners.length);
  });
  if (change) {
    const receiver = winners
      .map(i => (i < state.posSB ? [i, i + winners.length] : [i, i]))
      .sort((x, y) => x[1] - y[1])
      .pop()[0];
    state.stacks[receiver] += change;
  }
  xlog({ type: 'finished', value: `winner: ${winners.join(',')} pot: ${allpot}}` });
  return {
    stacks: state.stacks,
    players: state.players,
    SB: state.SB,
    lastBB: state.lastBB,
  };
};

const onegame = (state0) => {
  let state = initialize(state0);
  for (;;) {
    // advance with global state
    state = game.reducer(state, { type: 'phasecheck', value: {} });
    if (state.finished) break;

    // advance with player action
    const info = forNextPlayer(state);
    const action = playerAction(info);
    state = game.reducer(state, action);
  }
  return finalize(state);
};

module.exports = {
  onegame,
};
