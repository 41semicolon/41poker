const { range, shuffle } = require('./util.js');

const deck = () => shuffle(range(52));

module.exports = { deck };
