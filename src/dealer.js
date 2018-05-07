const { xlog, copy } = require('./util.js');
const { handval7 } = require('./handval.js');
const { playerAction } = require('./bot/index.js');
const game = require('./game.js');
const pot = require('./pot.js');
const { repr } = require('./card.js');

const initialize = (state0) => {
  const state = copy(state0);
  // no stack, no participate
  const folded = state.players.map((_, i) => state.stacks[i] < 2 * state.SB);
  if (folded.filter(x => !x).length < 2) throw Error('more player needed.');
  // decide SB, BB
  const { posBB, posSB, posBTN } = game.positionOf(folded, state.lastBB);
  const bets = state.players.map(() => 0);
  bets[posSB] = state.SB;
  bets[posBB] = state.SB * 2;
  const stacks = [...state.stacks];
  stacks[posSB] -= state.SB;
  stacks[posBB] -= state.SB * 2;
  return {
    ...state,
    pots: [0],
    commiters: [[]],
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
    bets,
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
    //console.log(state, shares);
  }

  return {
    stacks: state.stacks,
    players: state.players,
    SB: state.SB,
    lastBB: state.lastBB,
  };
};

const onegame = async (state0) => {
  let state = initialize(state0);
  for (;;) {
    // advance with global state
    state = game.reducer(state, { type: 'phasecheck', value: {} });
    if (state.finished) break;

    // advance with player action
    const info = forNextPlayer(state);
    const action = await playerAction(info);
    state = game.reducer(state, action);
  }
  return finalize(state);
};

module.exports = {
  onegame,
};
