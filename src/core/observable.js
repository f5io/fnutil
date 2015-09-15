const id = x => x;
const descriptor = {
  writable: false,
  enumerable: false,
  configurable: true
};

const EMIT = Symbol('Obs.EMIT');
const ERROR = Symbol('Obs.ERROR');
const ACTIVE = Symbol('Obs.ACTIVE');
const HANDLE = Symbol('Obs.HANDLE');

let Observable = {
  map(f) {
    let obs = of(f);
    if (this.active) obs.plug(this.fn(this.value));
    this.subscribers.push(obs);
    return obs;
  },
  mapPromise(f) {
    let obs = of(id, {
      [HANDLE]: function(v) {
        f(v)
          .then(x => {
            this[ACTIVE](true);
            this[EMIT](x);
          })
          .catch(e => {
            this[ERROR](e);
          });
      }
    });
    if (this.active) obs.plug(this.fn(this.value), false);
    this.subscribers.push(obs);
    return obs.map(id);
  },
  filter(f) {
    let obs = of(id, {
      [HANDLE]: function(v) {
        let res = f(v);
        this[ACTIVE](!!res);
        this[EMIT](v);
      }
    });
    if (this.active) obs.plug(this.fn(this.value), false);
    this.subscribers.push(obs);
    return obs;
  },
  filterNot(f) {
    return this.filter(v => !f(v));
  },
  plug(v, active = true) {
    Object.defineProperty(this, 'value', {
      value: v
    });
    this[ACTIVE](active);
    this[HANDLE](this.value);
    return this;
  },
  onValue(fn) {
    this.valueListeners.push(fn);
    if (this.active) fn(this.fn(this.value));
    return this;
  },
  onError(fn) {
    this.errorListeners.push(fn);
    return this;
  },
  valueOf() {
    return this.fn(this.value);
  },
  [ACTIVE]: function(boo) {
    this.subscribers.forEach(obs => obs[ACTIVE](boo));
    return Object.defineProperty(this, 'active', {
      value: boo
    });
  },
  [HANDLE]: function(v) {
    this[EMIT](this.fn(v));
  },
  [EMIT]: function(v) {
    if (!this.active) return;
    this.valueListeners.forEach(fn => fn(v));
    this.subscribers.forEach(obs => obs.plug(v, this.active));
  },
  [ERROR]: function(err) {
    this.errorListeners.forEach(fn => fn(err));
    this.subscribers.forEach(obs => obs[ERROR](err));
  }
}

function merge(...obs) {
  let ob = of(id, {
    [HANDLE]: function(v) {
      setTimeout(() => this[EMIT](this.fn(v)));
    }
  });
  obs.forEach(o => {
    o.subscribers.push(ob);
    o[HANDLE](o.value);
  });
  return ob;
}

function combine(obs, combinator = id) {
  let ob = of(combinator);
  let buffer = [];
  let addToBuffer = (i, v) => {
    buffer[i] = v;
    if (obs.length === buffer.filter(x => x).length) {
      ob.plug(buffer);
      buffer = [];
    }
  };
  obs.forEach((o, i) => {
    o.map(addToBuffer.bind(null, i));
  });
  return ob;
}

function of(val = id, proto = {}) {
  let isFunction = typeof val === 'function';
  let value = null;
  if (!isFunction) value = val;
  return Object.create({
    ...Observable,
    ...proto
  }, {
    value: {
      value: value,
      ...descriptor,
      enumerable: true
    },
    fn: {
      value: isFunction ? val : id,
      ...descriptor
    },
    active: {
      value: value !== null,
      ...descriptor
    },
    subscribers: {
      value: [],
      ...descriptor
    },
    valueListeners: {
      value: [],
      ...descriptor
    },
    errorListeners: {
      value: [],
      ...descriptor
    }
  });
}

export default { merge, combine, of };