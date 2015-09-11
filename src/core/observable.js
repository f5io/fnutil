const id = x => x;

let descriptor = {
  writable: false,
  enumerable: false,
  configurable: true
};

let Observable = {
  map(f) {
    let obs = of(f);
    if (this.active) obs.plug(this.fn(this.value));
    this.subscribers.push(obs);
    return obs;
  },
  mapPromise(f) {
    let obs = of(id, {
      _handle: function(v) {
        f(v).then(x => {
          this._setActive(true);
          this._emit(x);
        }).catch(e => console.log('err', e));
      }
    });
    if (this.active) obs.plug(this.fn(this.value), false);
    this.subscribers.push(obs);
    return obs.map(id);
  },
  filter(f) {
    let obs = of(id, {
      _handle: function(v) {
        let res = f(v);
        this._setActive(!!res);
        this._emit(v);
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
    this._setActive(active);
    this._handle(this.value);
    return this;
  },
  onValue(fn) {
    this.listeners.push(fn);
    if (this.active) fn(this.fn(this.value));
  },
  valueOf() {
    return this.fn(this.value);
  },
  _setActive(boo) {
    this.subscribers.forEach(obs => obs._setActive(boo));
    return Object.defineProperty(this, 'active', {
      value: boo
    });
  },
  _handle(v) {
    this._emit(this.fn(v));
  },
  _emit(v) {
    if (!this.active) return;
    this.listeners.forEach(fn => fn(v), this);
    this.subscribers.forEach(obs => obs.plug(v, this.active));
  }
}

function merge(...obs) {
  let ob = of(id, {
    _handle: function(v) {
      setTimeout(() => this._emit(this.fn(v)));
    }
  });
  obs.forEach(o => {
    o.subscribers.push(ob);
    o._handle(o.value);
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
    listeners: {
      value: [],
      ...descriptor
    }
  });
}

export default { merge, of };
