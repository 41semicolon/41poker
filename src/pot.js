// this module includes pot stuff.

const { copy, min, max } = require('./util.js');

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
  if (bets.filter(x => x !== 0).length === 0) { // everybody checks
    return [pots, commiters];
  }
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

// pots to winners!
// it assumes no one is folded, so put 9999 or something for folded players if exist.
const shares = (handvals, pots, commiters, posSB) => {
  const posOrder = handvals.map((_, i) => (i < posSB ? i + handvals.length : i)); // SB is the strongest
  const scores = Array(handvals.length).fill(0);
  pots.forEach((pot, i) => {
    const cs = commiters[i];
    const minval = min(handvals.filter((_, j) => cs.includes(j)));
    const winners = cs
      .filter(c => handvals[c] === minval)
      .sort((x, y) => (posOrder[x] - posOrder[y]));
    let rest = pot;
    winners.forEach((w) => { scores[w] += Math.floor(pot / winners.length); rest -= Math.floor(pot / winners.length); });
    if (rest) scores[winners[0]] += rest;
  });
  return scores;
};

module.exports = {
  potmake,
  shares,
};
