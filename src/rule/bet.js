const minimum = (BB, history) => {
  if (history.length === 0) { return BB; } // bet
  if (history.length === 1) { return 2 * history[0]; }// raise
  const last = history[history.length - 1];
  const sndlast = history[history.length - 2];
  return last + (last - sndlast); // reraise
};

const isValidAmount = (BB, history, amount) => {
  if (history.length === 0) { return amount >= BB; } // bet
  if (history.length === 1) { return amount >= 2 * history[0]; }// raise
  const last = history[history.length - 1];
  const sndlast = history[history.length - 2];
  return amount >= last + (last - sndlast);
};

module.exports = {
  minimum,
  isValidAmount,
};
