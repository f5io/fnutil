const id = x => x;

const emit = Symbol('emit');
const error = Symbol('error');
const active = Symbol('active');
const handle = Symbol('handle');

class Observable {
  static of(val) {
    return new Observable(val);
  }
  constructor(val = id) {
    const isFunction = typeof val === 'function';
    this.inValue = !isFunction ? val : null;
    this.outValue = this.inValue;
    this.fn = isFunction ? val : id;
    this.subscribers = [];
    this.valueListeners = [];
    this.errorListeners = [];
    this.active = this.inValue !== null;
  }
  map(f) {
    let obs = Observable.of(f);
    if (this.active) obs.plug(this.outValue);
    this.subscribers.push(obs);
    return obs;
  }
  mapPromise(f) {
    let obs = new DeferredObservable(f);
    if (this.active) obs.plug(this.outValue, false);
    this.subscribers.push(obs);
    return obs.map(id);
  }
  filter(f) {
    let obs = new FilteredObservable(f);
    if (this.active) obs.plug(this.outValue, false);
    this.subscribers.push(obs);
    return obs;
  }
  filterNot(f) {
    return this.filter(v => !f(v));
  }
  plug(v, act = true) {
    this.inValue = v;
    this[active](act);
    this[handle](this.inValue);
    return this;
  }
  sampledBy(obs) {
    let ob = Observable.of();
    obs.map(() => {
      ob.plug(this.fn(this.inValue))
    });
    return ob;
  }
  onValue(fn) {
    this.valueListeners.push(fn);
    if (this.active) fn(this.outValue);
    return this;
  }
  offValue(fn) {
    let index = this.valueListeners.indexOf(fn);
    if (index > -1) this.valueListeners.splice(index, 1);
    return this;
  }
  onError(fn) {
    this.errorListeners.push(fn);
    return this;
  }
  offError(fn) {
    let index = this.errorListeners.indexOf(fn);
    if (index > -1) this.errorListeners.splice(index, 1);
    return this;
  }
  valueOf() {
    return this.fn(this.inValue);
  }
  [active](boo) {
    this.subscribers.forEach(obs => obs[active](boo));
    this.active = boo;
    return this;
  }
  [handle](v) {
    this[emit](this.fn(v));
  }
  [emit](v) {
    if (!this.active) return;
    this.outValue = v;
    this.valueListeners.forEach(fn => fn(this.outValue));
    this.subscribers.forEach(obs => obs.plug(this.outValue, this.active));
  }
  [error](err) {
    this.errorListeners.forEach(fn => fn(err));
    this.subscribers.forEach(obs => obs[error](err));
  }
}

class DeferredObservable extends Observable {
  [handle](v) {
    this.fn(v)
      .then(x => {
        this[active](true);
        this[emit](x);
      })
      .catch(e => {
        this[error](e);
      });
  }
}

class FilteredObservable extends Observable {
  [handle](v) {
    let res = this.fn(v);
    this[active](!!res);
    this[emit](v);
  }
}

const of = Observable.of;

const merge = (obs) => {
  let ob = of();
  obs.forEach(o => {
    o.subscribers.push(ob);
    if (o.active) o[handle](o.value);
  });
  return ob;
}

const combine = (obs, combinator = id) => {
  let ob = of();
  let buffer = [];
  let addToBuffer = (i, v) => {
    buffer[i] = v;
    if (obs.length === buffer.filter(x => typeof x !== 'undefined').length) {
      ob.plug(combinator(buffer));
      buffer = [];
    }
  };
  obs.forEach((o, i) => {
    o.map(addToBuffer.bind(null, i));
  });
  return ob;
}

export default { of, merge, combine };
