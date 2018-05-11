const { copy, max, range, shuffle, xlog } = require('./util.js');
const pot = require('./pot.js');
const { handval7 } = require('./handval.js');
const { repr } = require('./card.js');

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
const positionOf = (flist, lastBB) => {
  const order = flist
    .map((val, i) => (i <= lastBB ? [i, i + flist.length, val] : [i, i, val]))
    .filter(x => !x[2]) // filter out folded players
    .sort((x, y) => x[1] - y[1]) // sort by effective index
    .map(x => x[0]);
  const posBB = order[0];
  const posSB = order[order.length - 1];
  const posBTN = order[((2 * order.length) - 2) % order.length];
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

// initialize
const init = (state0) => {
  const state = copy(state0);

  // no stack, no participate
  const folded = state.players.map((_, i) => state.stacks[i] < 2 * state.SB);
  if (folded.filter(x => !x).length < 2) throw Error('more player needed.');
  // decide SB, BB
  const { posBB, posSB, posBTN } = positionOf(folded, state.lastBB);
  const bets = state.players.map(() => 0);
  bets[posSB] = state.SB;
  bets[posBB] = state.SB * 2;
  const stacks = [...state.stacks];
  stacks[posSB] -= state.SB;
  stacks[posBB] -= state.SB * 2;

  return {
    ...state,
    // stacks
    stacks,
    pots: [0],
    commiters: [[]],
    phase: 0,
    // bet
    folded,
    bets,
    betchance: state.players.map(() => true),
    bethistory: [],
    // card
    board: state.deck.slice(0, 5),
    hcards: state.players.map((_, i) => [state.deck[5 + (2 * i)], state.deck[6 + (2 * i)]]),
    // position
    nextPlayer: posBTN,
    lastBB: posBB, // update in advance,
    posBB,
    posSB,
    posBTN,

    finished: false,
  };
};

const finalize = (state0) => {
  const state = copy(state0);
  const values = state.hcards // 9999 for folded.
    .map(h => [...state.board, ...h])
    .map((x, i) => (state.folded[i] ? 9999 : handval7(x)));
  const shares = pot.shares(
    values,
    state.pots,
    state.commiters,
    state.posSB,
  );
  shares.forEach((s, i) => { state.stacks[i] += s; });

  xlog({ type: 'finished', value: '' });

  // for human players
  if (state.players.includes('human')) {
    console.log(`Board: ${state.board.map(repr).join(' ')}`);
    shares.forEach((s, p) => {
      if (s === 0) return;
      console.log(`#${p} gains ${s} for ${state.hcards[p].map(repr).join(' ')}`);
    });
    const stacks = state.stacks.map((val, p) => `#${p}: ${val}`).join(',');
    console.log(`stack results in ${stacks}`);
  }

  return {
    stacks: state.stacks,
    players: state.players,
    SB: state.SB,
    lastBB: state.lastBB,
  };
};

const updateGameStatus = (state0) => {
  const state = copy(state0);
  const survivors = state.folded.map((x, i) => [i, x]).filter(x => !x[1]);
  if (survivors.filter(([i]) => state.betchance[i]).length === 0) { // phase end?
    state.phase += 1;
    const [pots, commiters] = pot.potmake(state.pots, state.commiters, state.bets); // make pots
    state.pots = pots;
    state.commiters = commiters;
    state.bets = Array(state.players.length).fill(0);
    state.betchance = Array(state.players.length).fill(true);
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
  let chipTocall;
  switch (action.type) {
    case ('fold'):
      state.folded[action.value.player] = true;
      break;
    case ('check'):
      state.betchance[action.value.player] = false;
      break;
    case ('call'):
      chipTocall = max(state.bets) - state.bets[action.value.player];
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

  init,
  positionOf,
  nextplayer,
  finalize,

  // just for tests
  __isValidAmount: isValidAmount,
};
