const { xlog } = require('./util.js');
const { handval7 } = require('./handval.js');
const { playerAction } = require('./bot/index.js');
const { numboard, reducer } = require('./game.js');

const initialize = (state0) => {
  const state = { ...state0 };
  // no stack, no participate
  const folded = state.players.map((_, i) => state.stacks[i] < 2 * state.SB);
  // decide SB, BB
  const order = folded
    .map((f, i) => (i < state.nextBTN ? [i, i + folded.length, f] : [i, i, f])) // memorize index number
    .filter(x => !x[2]) // filter out folded players
    .sort((x, y) => x[1] - y[1]) // sort by effective index
    .map(x => x[0]);
  if (order.length < 2) throw Error('cannnot start game');
  const bb = order[order.length - 1];
  const sb = order[order.length - 2];
  const betamount = state.players.map(() => 0);
  betamount[sb] = state.SB;
  betamount[bb] = state.SB * 2;
  const stacks = [...state.stacks];
  stacks[sb] -= state.SB;
  stacks[bb] -= state.SB * 2;
  return {
    ...state,
    pot: 0,
    phase: 0,
    betchance: state.players.map(() => true),
    board: state.deck.slice(0, 5),
    hcards: state.players.map((_, i) => [state.deck[5 + (2 * i)], state.deck[6 + (2 * i)]]),
    finished: false,
    nextPlayer: order[0],
    posBB: bb,
    posSB: sb,
    posBTN: order[0],
    folded,
    stacks,
    betamount,
  };
};

const forNextPlayer = (state) => {
  // who is next player? Most likely he/she is state.nextPlayer, but he/she might have folded
  const nPlayer = state.players.length;
  const player = state.folded
    .map((f, i) => (i < state.nextPlayer ? [i, i + nPlayer, f] : [i, i, f])) // keep index number
    .filter(([i, ii, f]) => !f && state.betchance[i]) // pick up who is not folded (and has bet chance, is this condition redundant?)
    .sort((x, y) => x[1] - y[1]) // sort by effective index
    .shift()[0];
  // conceal some information
  const { deck: _, board, hcards, ...rest } = state;
  return {
    ...rest,
    player,
    board: board.slice(0, numboard(state.phase)),
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
      .map(i => (i < state.nextBTN ? [i, i + state.nextBTN] : [i, i]))
      .sort((x, y) => x[1] - y[1])
      .pop()[0];
    state.stacks[receiver] += change;
  }
  xlog({ type: 'finished', value: `winner: ${winners.join(',')}` });
  return {
    stacks: state.stacks,
    players: state.players,
    SB: state.SB,
    nextBTN: (state.nextBTN + 1) % state.players.length,
  };
};

const onegame = (state0) => {
  let state = initialize(state0);
  for (;;) {
    // advance with global state
    state = reducer(state, { type: 'phasecheck', value: {} });
    if (state.finished) break;

    // advance with player action
    const info = forNextPlayer(state);
    const action = playerAction(info);
    state = reducer(state, action);
  }
  return finalize(state);
};

module.exports = {
  onegame,
};
