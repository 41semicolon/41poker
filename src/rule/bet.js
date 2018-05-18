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

const availableAction = (stack, BB, history) => {
  const actions = [{ type: 'fold', value: 0 }];
  const c2c = history.length === 0 ? 0 : history[history.length - 1];
  // check and call
  if (c2c === 0) {
    actions.push({ type: 'check', value: 0 });
  } else if (c2c <= stack) {
    actions.push({ type: 'call', value: c2c });
  }
  // allin
  if (stack !== 0) {
    actions.push({ type: 'allin', value: stack });
  }
  // raise
  const minbet = minimum(BB, history);
  if (stack >= minbet) {
    actions.push({ type: 'raise', value: minbet });
  }
  return actions;
};

module.exports = {
  minimum,
  isValidAmount,
  availableAction,
};
