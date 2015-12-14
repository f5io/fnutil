import test from 'tape';
import csp, { channel, timeout, put, take, alts } from '../src/csp';

test('[csp] methods', t => {
  t.plan(6);
  t.ok(csp, 'csp should be defined');
  t.ok(csp.channel, 'csp.channel should be defined');
  t.ok(csp.timeout, 'csp.timeout should be defined');
  t.ok(csp.put, 'csp.put should be defined');
  t.ok(csp.take, 'csp.take should be defined');
  t.ok(csp.alts, 'csp.alts should be defined');
});

test('[csp] channel', t => {
  t.plan(5);
  const chan = channel();
  t.deepEqual(Object.keys(chan), ['messages', 'takers', 'putters', 'racers'], 'should return a plain object with the relevant keys');
  t.ok(Array.isArray(chan.messages), 'should return with a `messages` array');
  t.ok(Array.isArray(chan.takers), 'should return with a `takers` array');
  t.ok(Array.isArray(chan.putters), 'should return with a `putters` array');
  t.ok(Array.isArray(chan.racers), 'should return with a `racers` array');
});

test('[csp] timeout', t => {
  t.plan(2);
  const to = timeout(10);
  t.ok(to instanceof Promise, 'should return an instance of a Promise');
  to.then(() => t.pass('should resolve after the timeout'));
});

test('[csp] put', t => {
  t.plan(6);
  const msg = 'foo';

  (() => {
    const chan = channel();
    const res = put(chan, msg);
    t.ok(res instanceof Promise, 'should return an instance of a Promise');
    t.deepEqual(chan.messages, [ msg ], 'should append the supplied message to the `messages` array');
    t.ok(chan.putters.length, 'should add the put resolve to the `putters` array');
  })();

  (() => {
    const chan = channel();
    const taker = m => t.equal(m, msg, 'should send the message to the taker');
    chan.takers.push(taker);
    put(chan, msg).then(() => t.pass('should resolve if there is a taker available'));
  })();

  (() => {
    const chan = channel();
    const racer = c => t.equal(c, chan, 'should send the channel to the racer');
    chan.racers.push(racer);
    put(chan, msg);
  })();
});

test('[csp] take', t => {
  t.plan(3);
  const msg = 'bar';

  (() => {
    const chan = channel();
    const res = take(chan);
    t.ok(res instanceof Promise, 'should return an instance of a Promise');
  })();

  (() => {
    const chan = channel();
    const putter = () => t.pass('should call the putter');
    chan.messages.push(msg);
    chan.putters.push(putter);
    take(chan).then(m => t.equal(m, msg, 'should resolve with the supplied message'));
  })();
});

test('[csp] alts', t => {
  t.plan(4);
  const msg = 'baz';

  const chA = channel();
  const chB = channel();
  const putter = () => t.pass('should call the putter');
  chA.messages.push(msg);
  chA.putters.push(putter);
  const res = alts(chA, chB);
  t.ok(chB.racers.length, 'should add the race resolve to the `racers` array');
  res.then(m => t.equal(m, msg, 'should resolve with the supplied message'));
  t.ok(res instanceof Promise, 'should return an instance of a promise');
});
