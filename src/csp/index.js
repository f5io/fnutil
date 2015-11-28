const isRace = Symbol('race');

const channel = () =>
  ({ messages: [], takers: [], putters: [], racers: [] });

const timeout = (ms) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const put = (ch, msg) =>
  new Promise(resolve => {
    ch.messages.unshift(msg);
    ch.putters.unshift(resolve);
    if (ch.takers.length) {
      ch.putters.pop()();
      ch.takers.pop()(ch.messages.pop());
    }
    if (ch.racers.length) {
      ch.racers.pop()(ch);
    }
  });

const take = (ch, race) =>
  new Promise(resolve => {
    if (race === isRace) {
      ch.racers.unshift(resolve);
      if (ch.putters.length) {
        ch.racers.pop()(ch);
      }
    } else {
      ch.takers.unshift(resolve);
      if (ch.putters.length) {
        ch.putters.pop()();
        ch.takers.pop()(ch.messages.pop())
      }
    }
  });

const alts = (...chs) =>
  Promise.race(chs.map(ch => take(ch, isRace)))
    .then(ch => {
      chs.filter(c => c !== ch).forEach(c => c.racers.pop())
      ch.putters.pop()();
      return ch.messages.pop();
    });

export default { channel, timeout, put, take, alts };
