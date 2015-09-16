import test from 'tape';
import observable from '../observable';

test('[observable] methods', t => {
  t.plan(4);
  t.ok(observable, 'observable should be defined');
  t.ok(observable.of, 'observable.of should be defined');
  t.ok(observable.merge, 'observable.merge should be defined');
  t.ok(observable.combine, 'observable.combine should be defined');
});

test('[observable] observable.of', t => {
  t.plan(1);
  let obsX = observable.of(1);
  obsX.onValue(v => t.equal(v, 1, 'should equal the value of the observable'));
  let obsY = observable.of();
  obsY.onValue(v => t.fail(`should not fire :- ${v}`));
});

test('[observable] observable.merge', t => {
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
  setTimeout(() => t.deepEqual(expected, output, 'should merge observables'), 10);
});

test('[observable] observable.combine', t => {
  t.plan(3);
  let obsX = observable.of(1);
  let obsY = observable.of(2);
  let obsZ = observable.of(3);

  (() => {
    const expected = [6, 15];
    let output = [];
    let obs = observable.combine([
      obsX, obsY, obsZ
    ], ([oX, oY, oZ]) => oX + oY + oZ).onValue(::output.push);
    obsX.plug(4);
    obsY.plug(5);
    obsZ.plug(6);
    t.deepEqual(expected, output, 'should combine observables with combinator');
  })();

  (() => {
    const expected = [[4, 5, 6], [1, 2, 3]];
    let output = [];
    let obs = observable.combine([
      obsX, obsY, obsZ
    ]).onValue(::output.push);
    obsX.plug(1);
    obsY.plug(2);
    obsZ.plug(3);
    t.deepEqual(expected, output, 'should combine observables');
  })();

  (() => {
    const expected = [15];
    let output = [];
    let obs = observable.combine([
      obsX, obsY, obsZ
    ], ([oX, oY, oZ]) => oX + oY + oZ).filter(v => v !== 6).onValue(::output.push);
    obsX.plug(4);
    obsY.plug(5);
    obsZ.plug(6);
    t.deepEqual(expected, output, 'should combine and filter');
  })();

});

test('[observable] Observable.map', t => {
  t.plan(1);
  let obsX = observable.of(1).map(x => x * 10);
  obsX.onValue(v => t.equal(v, 10, 'should equal the mapped value of the observable'));
  let obsY = observable.of().map(x => x * 5);
  obsY.onValue(v => t.fail(`should not fire :- ${v}`));
});

test('[observable] Observable.mapPromise', t => {
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

test('[observable] Observable.filter', t => {
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

test('[observable] Observable.filterNot', t => {
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

test('[observable] Observable.plug', t => {
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

test('[observable] Observable.sampledBy', t => {
  t.plan(1);
  let expected = [1, 1, 1];
  let output = [];
  let obsX = observable.of(1);
  let obsY = observable.of();
  obsX.sampledBy(obsY).onValue(::output.push);
  obsY.plug(4);
  obsY.plug(11);
  obsY.plug(12);
  t.deepEqual(expected, output, 'should output its own value each time the sampled observable fires');
});

test('[observable] Observable.onError', t => {
  t.plan(1);
  let obs = observable.of(1).mapPromise(v =>
    new Promise((r, reject) => setTimeout(reject, 100, v * 100)));
  obs.onError(err => t.pass('error handler should fire'));
});

test('[observable] Observable.onValue', t => {
  t.plan(1);
  let obs = observable.of(1);
  obs.onValue(v => t.pass('value handler should fire'));
});
