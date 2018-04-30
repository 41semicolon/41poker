const { range, shuffle } = require('./util.js');

const getdeck = () => shuffle(range(52));

module.exports = { getdeck };
