import test from 'tape';
import {
  curry,
  curryRight,
  memoize,
  observable
} from '../lib/core';

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

test('[core] observable', t => {
  t.plan(3);
  t.ok(observable, 'observable should be defined');
  t.ok(observable.of, 'observable.of should be defined');
  t.ok(observable.merge, 'observable.merge should be defined');
});

test('[core] observable.of', t => {
  t.plan(1);
  let obsX = observable.of(1);
  obsX.onValue(v => t.equal(v, 1, 'should equal the value of the observable'));
  let obsY = observable.of();
  obsY.onValue(v => t.fail(`should not fire :- ${v}`));
});

test('[core] observable.merge', t => {
  t.plan(1);
  const expected = [1, 8, 10, 4];
  let output = [];
  let obsX = observable.of(1);
  let obsY = observable.of(2);
  let obsZ = observable.of(3);
  let obs = observable.merge(
    obsX,
    obsY.filter(x => x === 2).map(x => x * 4),
    obsZ.filterNot(x => x === 3)
  ).onValue(::output.push);
  obsX.plug(10);
  obsY.plug(3);
  obsZ.plug(4);
  setTimeout(() => t.deepEqual(expected, output, 'should merge observables'), 20);
});

test('[core] Observable.map', t => {
  t.plan(1);
  let obsX = observable.of(1).map(x => x * 10);
  obsX.onValue(v => t.equal(v, 10, 'should equal the mapped value of the observable'));
  let obsY = observable.of().map(x => x * 5);
  obsY.onValue(v => t.fail(`should not fire :- ${v}`));
});

test('[core] Observable.mapPromise', t => {
  t.plan(4);
  let obs = observable.of(1).mapPromise(v =>
    new Promise(resolve => setTimeout(resolve, 100, v * 100)));
  obs.onValue(v => t.equal(v, 100, 'should be equal to the result of the promise'));
  obs.filterNot(x => x === 100).onValue(v => t.fail(`should not fire :- ${v}`));
  obs.filter(x => x === 100).onValue(v => t.equal(v, 100, 'should fire and be equal to the result of the promise'));
  obs.map(x => x * 25).onValue(v => t.equal(v, 2500, 'should be equal to the value of the `mapped` observable'));
  obs.mapPromise(v =>
    new Promise(resolve => setTimeout(resolve, 100, v * 25)))
    .onValue(v => t.equal(v, 2500, 'should be equal to the chained promises output'));
});

test('[core] Observable.filter', t => {
  t.plan(2);
  let obs = observable.of(1);
  let equalTwo = obs.filter(x => x === 2);
  let equalOne = obs.filter(x => x === 1);

  equalTwo.onValue(v => t.fail(`should not fire :- ${v}`));
  equalOne.onValue(v => t.equal(v, 1, 'should fire and be equal to the value of the observable'));
  equalTwo.map(x => x * 5).onValue(v => t.fail(`should not fire :- ${v}`));
  equalOne.map(x => x * 10).onValue(v => t.equal(v, 10, 'should fire and be equal to the value of the `mapped` observable'));
  equalOne.filterNot(x => x === 1).onValue(v => t.fail(`should not fire :- ${v}`));
  equalOne.filterNot(x => x === 1).map(x => x * 2).onValue(v => t.fail(`should not fire :- ${v}`));
});

test('[core] Observable.filterNot', t => {
  t.plan(2);
  let obs = observable.of(1);
  let notEqualTwo = obs.filterNot(x => x === 2);
  let notEqualOne = obs.filterNot(x => x === 1);

  notEqualTwo.onValue(v => t.equal(v, 1, 'should fire and be equal to the value of the observable'));
  notEqualOne.onValue(v => t.fail(`should not fire :- ${v}`));
  notEqualTwo.map(x => x * 10).onValue(v => t.equal(v, 10, 'should fire and be equal to the value of the `mapped` observable'));
  notEqualOne.map(x => x * 5).onValue(v => t.fail(`should not fire :- ${v}`));
  notEqualTwo.filter(x => x === 2).onValue(v => t.fail(`should not fire :- ${v}`));
  notEqualTwo.filter(x => x === 2).map(x => x * 2).onValue(v => t.fail(`should not fire :- ${v}`));
});

test('[core] Observable.plug', t => {
  t.plan(3);
  let firstVal = true;
  let obs = observable.of(1);
  obs.onValue(v => {
    if (firstVal) {
      t.equal(v, 1, 'should equal the value of the observable');
      firstVal = false;
    } else {
      t.equal(v, 4, 'should equal the new value `plugged` into the observable');
    }
  });
  obs.map(x => x * 2).filter(x => x === 8).onValue(v => t.equal(v, 8, 'should only fire once with the correct value'));
  obs.plug(4);
});
