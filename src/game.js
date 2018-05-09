const { copy, max, range, shuffle, xlog } = require('./util.js');
const { potmake } = require('./pot.js');

const deck = () => shuffle(range(52));

const numboard = (phase) => {
  switch (phase) {
    case 0: return 0; // preflop
    case 1: return 3; // flop
    case 2: return 4; // turn
    default: return 5; // river and after
  }
};

// position finding algorithm
// used for 1. determine BTN, and 2. determine next player
const positionOf = (flist, lastBB) => {
  const order = flist
    .map((val, i) => (i <= lastBB ? [i, i + flist.length, val] : [i, i, val]))
    .filter(x => !x[2]) // filter out folded players
    .sort((x, y) => x[1] - y[1]) // sort by effective index
    .map(x => x[0]);
  const posBB = order[0];
  const posSB = order[order.length - 1];
  const posBTN = order[order.length - 2];
  return { posBB, posSB, posBTN };
};

// who is next player? Most likely he/she is state.nextPlayer, but he/she might have folded
const nextplayer = (flist, clist, cand) => flist
  .map((val, i) => (i < cand ? [i, i + flist.length, val] : [i, i, val]))
  .filter(x => !x[2] && clist[x[0]]) // filter out folded players and players already done.
  .sort((x, y) => x[1] - y[1]) // sort by effective index
  .map(x => x[0])
  .shift();

// bet checker
const isValidAmount = (BB, history, amount) => {
  if (history.length === 0) { return amount >= BB; } // bet
  if (history.length === 1) { return amount >= 2 * history[0]; }// raise
  const last = history[history.length - 1];
  const sndlast = history[history.length - 2];
  return amount >= last + (last - sndlast);
};

const updateGameStatus = (state0) => {
  const state = copy(state0);
  const survivors = state.folded.map((x, i) => [i, x]).filter(x => !x[1]);
  if (survivors.filter(([i]) => state.betchance[i]).length === 0) { // phase end?
    state.phase += 1;
    const [pots, commiters] = potmake(state.pots, state.commiters, state.bets); // make pots
    state.pots = pots;
    state.commiters = commiters;
    state.bets = state.players.map(() => 0);
    state.betchance = state.players.map(() => true);
    state.bethistory = [];
    state.nextPlayer = state.posSB; // SB is the first player after preflop.
    xlog({ type: 'phaseshift', value: state.phase });
  }
  if (survivors.length === 1) return { ...state, finished: true };
  if (state.phase === 4) return { ...state, finished: true };
  return state;
};

const reducer = (state0, action) => {
  let state = copy(state0);
  switch (action.type) {
    case ('fold'):
      state.folded[action.value.player] = true;
      break;
    case ('check'):
      state.betchance[action.value.player] = false;
      break;
    case ('call'):
      const chipTocall = max(state.bets) - state.bets[action.value.player];
      state.betchance[action.value.player] = false;
      state.bets[action.value.player] += chipTocall;
      state.stacks[action.value.player] -= chipTocall;
      break;
    case ('raise'):
    case ('allin'): // raise and allin are no diffrent in our program, but validation logic will be diffrent.
      state.betchance = state.players.map(() => true); // reset.
      state.betchance[action.value.player] = false;
      state.bets[action.value.player] += action.value.amount;
      state.stacks[action.value.player] -= action.value.amount;
      state.bethistory.push(action.value.amount);
      break;
    case ('phasecheck'):
      state = updateGameStatus(state);
      break;

    default: throw Error(`invalid action ${JSON.stringify(action)}`);
  }
  return {
    ...state,
    nextPlayer: (action.value.player
      ? (action.value.player + 1) % state.players.length
      : state.nextPlayer),
  };
};

module.exports = {
  deck,
  numboard,
  reducer,

  positionOf,
  nextplayer,

  // just for tests
  __isValidAmount: isValidAmount,
};
