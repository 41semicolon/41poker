const { copy, min } = require('./util.js');

// used by the function below. recursive structure
const sidepot = (pots0, commiters0, bets0) => {
  const [pots, commiters, bets] = [copy(pots0), copy(commiters0), copy(bets0)];
  // 1. return
  if (bets.filter(x => x !== 0).length === 0) {
    return [pots, commiters];
  }
  // 2. recursive call
  const minval = min(bets.filter(x => x !== 0));
  let pot = 0;
  const comm = [];
  for (let i = 0; i < bets.length; i += 1) {
    if (bets[i] === 0) {
      continue;
    }
    pot += minval;
    bets[i] -= minval;
    comm.push(i);
  }
  pots.push(pot);
  commiters.push(comm);
  return sidepot(pots, commiters, bets); // tail call. recursive
};

// invoked at the end of every betting round.
// betamount -> pots, potCommiters
const potmake = (pots0, commiters0, bets0) => {
  const [pots, commiters, bets] = [copy(pots0), copy(commiters0), copy(bets0)];
  // add bets to current pot.
  const minval = min(bets.filter(x => x !== 0));
  if (minval <= 0) throw Error('something wrong');
  commiters[commiters.length - 1] = [];
  for (let i = 0; i < bets.length; i += 1) {
    if (bets[i] === 0) {
      continue;
    }
    pots[pots.length - 1] += minval;
    bets[i] -= minval;
    commiters[commiters.length - 1].push(i); // he may already folded, but it is ok.
  }
  // if bets are totally empty, that's good. no side pot. returns.
  if (bets.filter(x => x !== 0).length === 0) {
    return [pots, commiters];
  }
  // else, we have to handle side pot.
  return sidepot(pots, commiters, bets);
};

module.exports = {
  potmake,
};
