import test from 'tape';
import lib from '../src';
import { curry } from '../src/core';
import {
  filter,
  filterSplit,
  combine,
  compose,
  map,
  sort,
  uniq
} from '../src/utils';
import { curry as curryDec } from '../src/decorators';

const data = Array.from({ length: 10 }, (v, k) => ++k);

let divisibleByTwo = filter(x => x % 2 === 0);
let divisibleByThree = filter(x => x % 3 === 0);

test('[lib] all tools exist in package', t => {
  t.plan(16);
  t.ok(lib.core, 'lib.core should be defined');
  t.ok(lib.core.curry, 'lib.core.curry should be defined');
  t.equal('function', typeof lib.core.curry, 'lib.core.curry should be a function');
  t.ok(lib.core.curryRight, 'lib.core.curryRight should be defined');
  t.equal('function', typeof lib.core.curryRight, 'lib.core.curryRight should be a function');
  t.ok(lib.core.memoize, 'lib.core.memoize should be defined');
  t.equal('function', typeof lib.core.memoize, 'lib.core.memoize should be a function');
  t.ok(lib.decorators, 'lib.decorators should be defined');
  t.ok(lib.decorators.curry, 'lib.decorators.curry should be defined');
  t.equal('function', typeof lib.decorators.curry, 'lib.decorators.curry should be a function');
  t.ok(lib.decorators.curryRight, 'lib.decorators.curryRight should be defined');
  t.equal('function', typeof lib.decorators.curryRight, 'lib.decorators.curryRight should be a function');
  t.ok(lib.decorators.memoize, 'lib.decorators.memoize should be defined');
  t.equal('function', typeof lib.decorators.memoize, 'lib.decorators.memoize should be a function');
  t.ok(lib.observable, 'lib.observable should be defined');
  t.ok(lib.utils, 'lib.utils should be defined');
});

test('[lib] tools can be destructured', t => {
  t.plan(6);
  t.ok(curry, 'curry should be defined');
  t.equal('function', typeof curry, 'curry should be a function');
  t.ok(curryDec, 'curry decorator should be defined');
  t.equal('function', typeof curryDec, 'curry decorator should be a function');
  t.ok(map, 'curried map should be defined');
  t.equal('function', typeof map, 'curried map should be a function');
});

test('[lib] composing some functions', t => {
  t.plan(1);
  let fn = compose(
    filter(x => x < 10),
    map(x => x * 2),
    sort((a, b) => a - b),
    combine,
    filterSplit(divisibleByTwo, divisibleByThree)
  );
  t.deepEqual(fn(data), [4, 6, 8], 'should output correct value');
});

test('[lib] large complex compose', t => {
  t.plan(1);
  let fn = compose(
    uniq,
    combine,
    filterSplit(
      compose(
        sort((a, b) => b - a),
        map(x => (x / 2) + 5),
        divisibleByTwo
      ),
      compose(
        map(x => x * 2),
        divisibleByThree
      )
    ),
    map(x => x * 5)
  );
  t.deepEqual(fn(data), [30, 25, 20, 15, 10, 60, 90], 'should output correct value');
});
