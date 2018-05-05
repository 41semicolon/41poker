const { max, xlog } = require('../util.js');
const { hsPreflop } = require('../hcard.js');

const chipTocall = (info, myID) => max(info.betamount) - info.betamount[myID];

// a very very weak bot. it only checks or folds.
const weakest = (daction) => {
  const myID = daction.player;
  const p = { player: myID };
  return (chipTocall(daction, myID) === 0)
    ? { type: 'check', value: { ...p } }
    : { type: 'fold', value: { ...p } };
};

// a bot simulating calling stations.
const dull = (daction) => {
  const myID = daction.player;
  const mystack = daction.stacks[myID];
  const c2c = chipTocall(daction, myID);
  const p = { player: myID };

  if (c2c === 0) return { type: 'check', value: { ...p } };
  if (mystack < c2c) return { type: 'fold', value: { ...p } };
  return { type: 'call', value: { ...p } };
};

// a bot trying to steal BBs
const stealer = (info) => {
  const myID = info.player;
  const mystack = info.stacks[myID];
  const c2c = chipTocall(info, myID);
  const p = { player: myID };

  if (info.phase === 0) {
  }
};

// a very naive bot. it never raises.
// it folds only at preflop when his hole card is not met the odds(not potodds, but raw odds).
// Otherwise he acts like a dull bot(i.e. calling station).
const baby = (daction) => {
  const myID = daction.player;
  const mystack = daction.stacks[myID];
  const c2c = chipTocall(daction, myID);
  const p = { player: myID };

  // decision make
  if (c2c === 0) return { type: 'check', value: { ...p } };
  if (mystack < c2c) return { type: 'fold', value: { ...p } };
  if (daction.phase === 0) {
    const nPlayer = daction.folded.map(x => !x).length;
    const hsval = hsPreflop(nPlayer, daction.hcard) / 100.0;
    if (hsval < 1.0 / nPlayer) {
      return { type: 'fold', value: { ...p } };
    }
  }
  return { type: 'call', value: { ...p } };
};

const botlookup = (name) => {
  switch (name) {
    case 'weakest': return weakest;
    case 'dull': return dull;
    case 'stealer': return stealer;
    case 'baby': return baby;
    default: throw Error(`no such bot ${name}`);
  }
};

const playerAction = (info) => {
  const bot = botlookup(info.players[info.player]);
  const action = bot(info);
  return xlog(action);
};

module.exports = {
  playerAction,
};
