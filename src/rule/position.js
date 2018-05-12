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

module.exports = {
  positionOf,
  nextplayer,
};
