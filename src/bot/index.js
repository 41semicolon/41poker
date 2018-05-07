const { max, xlog } = require('../util.js');
const { hsPreflop } = require('../hcard.js');
const { human } = require('./human.js');

const chipTocall = (info, myID) => max(info.bets) - info.bets[myID];

// a very very weak bot. it only checks or folds.
const weakest = async (info) => {
  const myID = info.player;
  const p = { player: myID };
  return (chipTocall(info, myID) === 0)
    ? { type: 'check', value: { ...p } }
    : { type: 'fold', value: { ...p } };
};

// a bot to all-in
const crazy = async (info) => {
  const myID = info.player;
  const mystack = info.stacks[myID];
  const c2c = chipTocall(info, myID);
  const p = { player: myID };

  if (mystack !== c2c) return { type: 'allin', value: { ...p, amount: mystack } };
  return { type: 'call', value: { ...p } };
};


// a bot simulating calling stations.
const dull = async (info) => {
  const myID = info.player;
  const mystack = info.stacks[myID];
  const c2c = chipTocall(info, myID);
  const p = { player: myID };

  if (c2c === 0) return { type: 'check', value: { ...p } };
  if (mystack < c2c) return { type: 'fold', value: { ...p } };
  return { type: 'call', value: { ...p } };
};

// a bot trying to steal blinds at preflop
const stealer = async (info) => {
  const myID = info.player;
  const mystack = info.stacks[myID];
  const c2c = chipTocall(info, myID);
  const p = { player: myID };

  if (
    info.phase === 0 && // at preflop
    myID !== info.posSB && // not SB
    myID !== info.posBB && // not BB
    c2c < 6 * info.SB && // other player does not raise too much
    mystack > 6 * info.SB && // have enough stack
    6 * info.SB > 2 * c2c // minimum raise or above
  ) return { type: 'raise', value: { ...p, amount: 6 * info.SB } };

  // if not returns above, it acts as dull
  if (c2c === 0) return { type: 'check', value: { ...p } };
  if (mystack < c2c) return { type: 'fold', value: { ...p } };
  return { type: 'call', value: { ...p } };
};

// a very naive bot. it never raises.
// it folds only at preflop when his hole card is not met the odds(not potodds, but raw odds).
// Otherwise he acts like a dull bot(i.e. calling station).
const baby = async (info) => {
  const myID = info.player;
  const mystack = info.stacks[myID];
  const c2c = chipTocall(info, myID);
  const p = { player: myID };

  // decision make
  if (c2c === 0) return { type: 'check', value: { ...p } };
  if (mystack < c2c) return { type: 'fold', value: { ...p } };
  if (info.phase === 0) {
    const nPlayer = info.folded.map(x => !x).length;
    const hsval = hsPreflop(nPlayer, info.hcard) / 100.0;
    if (hsval < 1.0 / nPlayer) {
      return { type: 'fold', value: { ...p } };
    }
  }
  return { type: 'call', value: { ...p } };
};

const botlookup = (name) => {
  switch (name) {
    case 'human': return human;
    case 'weakest': return weakest;
    case 'crazy': return crazy;
    case 'dull': return dull;
    case 'stealer': return stealer;
    case 'baby': return baby;
    default: throw Error(`no such bot ${name}`);
  }
};

const playerAction = async (info) => {
  const bot = botlookup(info.players[info.player]);
  const action = await bot(info);
  return xlog(action);
};

module.exports = {
  playerAction,
};
