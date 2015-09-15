import test from 'tape';
import lib from '../';
import { filterNot, curryRight } from '../';
import { curry } from '../core';
import {
  filter,
  filterSplit,
  combine,
  compose,
  map,
  sort,
  uniq
} from '../utils';
import { curry as curryDec } from '../decorators';

const data = Array.from({ length: 10 }, (v, k) => ++k);

let divisibleByTwo = filter(x => x % 2 === 0);
let divisibleByThree = filter(x => x % 3 === 0);

test('[lib] all tools exist in package', t => {
  t.plan(3);
  t.ok(lib.core, 'lib.core should be defined');
  t.ok(lib.decorators, 'lib.decorators should be defined');
  t.ok(lib.utils, 'lib.utils should be defined');
});

test('[lib] tools can be destructured', t => {
  t.plan(3);
  t.ok(curry, 'curry should be defined');
  t.ok(curryDec, 'curry decorator should be defined');
  t.ok(map, 'curried map should be defined');
});

test('[lib] tools are exposed on the lib root', t => {
  t.plan(2);
  t.ok(filterNot, 'filterNot should be defined');
  t.ok(curryRight, 'curryRight should be defined');
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
