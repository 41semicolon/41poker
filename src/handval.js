// Performance first, avoiding loop, conditional, unnecessary variables.
/* eslint no-bitwise: 'off' */

const { dp, scode, rcode, flushcheck, flush, noflush5, noflush6, noflush7 } = require('./tables/handval-tables.js');

const hashQuinary = (q, len, kk) => {
  let sum = 0;
  let k = kk;
  for (let i = 0; i < len; i += 1) {
    sum += dp[q[i]][len - i - 1][k];
    k -= q[i];
    if (k <= 0) break;
  }
  return sum;
};

const handval5 = ([c1, c2, c3, c4, c5]) => {
  // 1. if flush, lookup flush[]
  const shash = scode[c1] + scode[c2] + scode[c3] + scode[c4] + scode[c5];
  if (flushcheck[shash]) {
    const rcodes = [0, 0, 0, 0]; // 13bit hand representation by suit
    const index = flushcheck[shash] - 1; // index of rcodes we focus on.
    rcodes[c1 & 0x3] |= rcode[c1];
    rcodes[c2 & 0x3] |= rcode[c2];
    rcodes[c3 & 0x3] |= rcode[c3];
    rcodes[c4 & 0x3] |= rcode[c4];
    rcodes[c5 & 0x3] |= rcode[c5];
    return flush[rcodes[index]];
  }
  // 2. else lookup noflush5[]
  const q = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // quinary
  q[(c1 >> 2)] += 1;
  q[(c2 >> 2)] += 1;
  q[(c3 >> 2)] += 1;
  q[(c4 >> 2)] += 1;
  q[(c5 >> 2)] += 1;
  const hashed = hashQuinary(q, 13, 5);
  return noflush5[hashed];
};

const handval6 = ([c1, c2, c3, c4, c5, c6]) => {
  // 1. if flush, lookup flush[]
  const shash = scode[c1] + scode[c2] + scode[c3] + scode[c4] + scode[c5] + scode[c6];
  if (flushcheck[shash]) {
    const rcodes = [0, 0, 0, 0]; // 13bit hand representation by suit
    const index = flushcheck[shash] - 1; // index of rcodes we focus on.
    rcodes[c1 & 0x3] |= rcode[c1];
    rcodes[c2 & 0x3] |= rcode[c2];
    rcodes[c3 & 0x3] |= rcode[c3];
    rcodes[c4 & 0x3] |= rcode[c4];
    rcodes[c5 & 0x3] |= rcode[c5];
    rcodes[c6 & 0x3] |= rcode[c6];
    return flush[rcodes[index]];
  }
  // 2. else lookup noflush6[]
  const q = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // quinary
  q[(c1 >> 2)] += 1;
  q[(c2 >> 2)] += 1;
  q[(c3 >> 2)] += 1;
  q[(c4 >> 2)] += 1;
  q[(c5 >> 2)] += 1;
  q[(c6 >> 2)] += 1;
  const hashed = hashQuinary(q, 13, 6);
  return noflush6[hashed];
};

const handval7 = ([c1, c2, c3, c4, c5, c6, c7]) => {
  // 1. if flush, lookup flush[]
  const shash = scode[c1] + scode[c2] + scode[c3] + scode[c4] + scode[c5] + scode[c6] + scode[c7];
  if (flushcheck[shash]) {
    const rcodes = [0, 0, 0, 0]; // 13bit hand representation by suit
    const index = flushcheck[shash] - 1; // index of rcodes we focus on.
    rcodes[c1 & 0x3] |= rcode[c1];
    rcodes[c2 & 0x3] |= rcode[c2];
    rcodes[c3 & 0x3] |= rcode[c3];
    rcodes[c4 & 0x3] |= rcode[c4];
    rcodes[c5 & 0x3] |= rcode[c5];
    rcodes[c6 & 0x3] |= rcode[c6];
    rcodes[c7 & 0x3] |= rcode[c7];
    return flush[rcodes[index]];
  }
  // 2. else lookup noflush7[]
  const q = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // quinary
  q[(c1 >> 2)] += 1;
  q[(c2 >> 2)] += 1;
  q[(c3 >> 2)] += 1;
  q[(c4 >> 2)] += 1;
  q[(c5 >> 2)] += 1;
  q[(c6 >> 2)] += 1;
  q[(c7 >> 2)] += 1;
  const hashed = hashQuinary(q, 13, 7);
  return noflush7[hashed];
};

const handval = (hand) => {
  switch (hand.length) {
    case 5: return handval5(hand);
    case 6: return handval6(hand);
    case 7: return handval7(hand);
    default: throw Error('hand must be 5/6/7 of length');
  }
};

module.exports = { handval, handval5, handval6, handval7 };
