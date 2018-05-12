const pot = require('./pot.js');
const position = require('./position.js');

module.exports = {
  potmake: pot.potmake,
  shares: pot.shares,

  positionOf: position.positionOf,
  nextplayer: position.nextplayer,
};
