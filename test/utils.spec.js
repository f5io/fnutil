import test from 'tape';
import {
  filter,
  filterNot,
  filterSplit,
  flatten,
  combine,
  compose,
  composeLeft,
  map,
  reduce,
  sort,
  uniq
} from '../lib/utils';

const data = Array.from({ length: 10 }, (v, k) => ++k);

let divisibleByTwo = x => x % 2 === 0;
let divisibleByThree = x => x % 3 === 0;
let minusTwo = x => x - 2;
let plusFour = x => x + 4;
let timesTwo = x => x * 2;

test('[utils] compose', t => {
  t.plan(1);
  let fn = compose(timesTwo, plusFour, minusTwo);
  t.equal(fn(9), 22, 'should reduce functions right to left');
});

test('[utils] composeLeft', t => {
  t.plan(1);
  let fn = composeLeft(timesTwo, plusFour, minusTwo);
  t.equal(fn(9), 20, 'should reduce functions left to right');
});

test('[utils] filter', t => {
  t.plan(1);
  let fn = filter(divisibleByTwo);
  t.deepEqual(fn(data), [2, 4, 6, 8, 10], 'should curry an array`s filter method');
});

test('[utils] filterNot', t => {
  t.plan(1);
  let fn = filterNot(divisibleByTwo);
  t.deepEqual(fn(data), [1, 3, 5, 7, 9], 'should curry and inverse and array`s filter method');
});

test('[utils] filterSplit', t => {
  t.plan(1);
  let fn = filterSplit(filter(divisibleByTwo), filter(divisibleByThree));
  t.deepEqual(fn(data), [[2, 4, 6, 8, 10], [3, 6, 9]], 'should return the correct result');
});

test('[utils] flatten', t => {
  t.plan(1);
  let d = filterSplit(filter(divisibleByTwo), filter(divisibleByThree))(data);
  t.deepEqual(flatten(d), [2, 4, 6, 8, 10, 3, 6, 9], 'should flatten an array');
});

test('[utils] combine', t => {
  t.plan(1);
  let d = [['one', 1, 'two', 2], ['three', 3, 'four', 4]];
  t.deepEqual(combine(d), ['one', 1, 'two', 2, 'three', 3, 'four', 4], 'should concat arrays together');
});

test('[utils] map', t => {
  t.plan(1);
  let fn = map(x => x + 1);
  t.deepEqual(fn(data), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'should curry an array`s map method');
});

test('[utils] reduce', t => {
  t.plan(1);
  let fn = reduce((acc, x) => acc + x, 0);
  t.deepEqual(fn(data), 55, 'should curry an array`s reduce method');
});

test('[utils] sort', t => {
  t.plan(2);
  let fn = sort((a, b) => b - a);
  t.deepEqual(fn(data), [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 'should curry an array`s sort method');
  t.deepEqual(data, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'should not mutate the original');
});

test('[utils] uniq', t => {
  t.plan(1);
  let d = [1, 2, 4, 5, 4, 1, 2, 2];
  t.deepEqual(uniq(d), [1, 2, 4, 5], 'should remove duplicate elements from an array');
});
