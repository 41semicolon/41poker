const readline = require('readline');
const { repr } = require('../index.js');
const { max } = require('../util.js');

const chipTocall = (info, myID) => max(info.bets) - info.bets[myID];

const work = (line, resolve, info) => {
  if (line === 'A') {
    resolve({ type: 'allin', value: { player: info.player, amount: info.stacks[info.player] } });
  }
  if (line === 'f') {
    resolve({ type: 'fold', value: { player: info.player } });
  }
  if (line.match(/r(\d+)/)) {
    resolve({ type: 'raise', value: { player: info.player, amount: parseInt(line.match(/r(\d+)/)[1], 10) } });
  }
  resolve(false);
};

const human = async (info) => {
  const myID = info.player;
  const mystack = info.stacks[myID];
  const c2c = chipTocall(info, myID);
  const p = { player: myID };

  // show information
  const round = ['preflop', 'flop', 'turn', 'river'][info.phase];
  const brepr = info.board.map(repr).join(' ');
  const hrepr = info.hcard.map(repr).join(' ');
  console.log(`<${round} ${c2c} to check/call> Hand: ${hrepr}, Board: ${brepr}, pot: ${info.pots}, chip: ${info.stacks[info.player]}`);

  // wait your action
  const reader = readline.createInterface({ input: process.stdin });
  const promise = new Promise(r => reader.on('line', line => work(line, r, info)));
  const result = await promise;
  reader.close();

  // returns specified action if exist
  if (result) return result;
  if (c2c === 0) return { type: 'check', value: { ...p } };
  if (mystack < c2c) return { type: 'fold', value: { ...p } };
  return { type: 'call', value: { ...p } };
};

module.exports = {
  human,
};
