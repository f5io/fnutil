import test from 'tape';
import {
  curry,
  curryRight,
  memoize
} from '../core';

let toCurry = (x, y, z) => (x * y) + z;

test('[core] curry', t => {
  t.plan(1);
  let fn = curry(toCurry);
  t.equal(fn(1)(2)(3), 5, 'should curry arguments left to right');
});

test('[core] curryRight', t => {
  t.plan(1);
  let fn = curryRight(toCurry);
  t.equal(fn(3)(2)(1), 5, 'should curry arguments right to left');
});

test('[core] memoize', t => {
  t.plan(3);
  let fn = memoize(toCurry);
  t.equal(fn.length, toCurry.length, 'should retain a function`s arity');
  t.equal(fn(1, 2, 3), 5, 'should return the expected result');
  t.equal(fn._cache().size, 1, 'should cache resulting calls');
});
