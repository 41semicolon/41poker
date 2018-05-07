/* eslint no-restricted-syntax: 'off' */

const _ = require('lodash');

function* combinations(size, arr) {
  if (size === 1) {
    for (const x of arr) yield [x];
    return;
  }
  for (const fst of arr) {
    const filtered = arr.filter(x => x > fst);
    const ite = combinations(size - 1, filtered);
    for (const snd of ite) yield [fst, ...snd];
  }
}

const forEachCombination2Apply = (f, arr) => {
  const l = arr.length;
  for (let c1 = 0; c1 < l - 1; c1 += 1) {
    for (let c2 = c1 + 1; c2 < l; c2 += 1) {
      f([arr[c1], arr[c2]]);
    }
  }
};

const forEachCombination5Apply = (f, arr) => {
  const l = arr.length;
  for (let c1 = 0; c1 < l - 4; c1 += 1) {
  for (let c2 = c1 + 1; c2 < l - 3; c2 += 1) {
  for (let c3 = c2 + 1; c3 < l - 2; c3 += 1) {
  for (let c4 = c3 + 1; c4 < l - 1; c4 += 1) {
  for (let c5 = c4 + 1; c5 < l; c5 += 1) {
    f([arr[c1], arr[c2], arr[c3], arr[c4], arr[c5]]);
  }}}}}
};

const forEachCombination7Apply = (f, arr) => {
  const l = arr.length;
  for (let c1 = 0; c1 < l - 6; c1 += 1) {
  for (let c2 = c1 + 1; c2 < l - 5; c2 += 1) {
  for (let c3 = c2 + 1; c3 < l - 4; c3 += 1) {
  for (let c4 = c3 + 1; c4 < l - 3; c4 += 1) {
  for (let c5 = c4 + 1; c5 < l - 2; c5 += 1) {
  for (let c6 = c5 + 1; c6 < l - 1; c6 += 1) {
  for (let c7 = c6 + 1; c7 < l; c7 += 1) {
    f([arr[c1], arr[c2], arr[c3], arr[c4], arr[c5], arr[c6], arr[c7]]);
  }}}}}}}
};

const forEachCombinationApply = (f, size, arr) => {
  switch (size) {
    case 2: forEachCombination2Apply(f, arr); break;
    case 5: forEachCombination5Apply(f, arr); break;
    case 7: forEachCombination7Apply(f, arr); break;
    default:
      for (const elem of combinations(size, arr)) {
        f(elem);
      }
  }
  return null; // this function returns nothing
};

const simulateN = nSample => (fn, fnAcc, initAcc) => {
  let ret = initAcc;
  for (let i = 0; i < nSample; i += 1) {
    ret = fnAcc(ret, fn());
  }
  return ret;
};

const xlog = (entry) => {
  //console.log(entry);
  return entry;
};

module.exports = {
  combinations,
  forEachCombinationApply,
  simulateN,
  xlog,
  range: _.range,
  shuffle: _.shuffle,
  max: _.max,
  min: _.min,
  copy: _.cloneDeep,
};
