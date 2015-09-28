import { curry } from '../decorators';

let flatten = (a) => a.reduce((acc, x) =>
  Array.isArray(x) ? acc.concat(flatten(x)) :
  acc.concat(x), []);

export default {
  @curry
  filter(fn, x) {
    return x.filter(fn);
  },
  @curry
  filterNot(fn, x) {
    return x.filter(y => !fn(y));
  },
  @curry
  map(fn, x) {
    return x.map(fn);
  },
  @curry
  reduce(fn, y, x) {
    return x.reduce(fn, y);
  },
  @curry
  concat(y, x) {
    return x.concat(y);
  },
  @curry
  sort(fn, x) {
    return Array.from(x).sort(fn);
  },
  compose(...a) {
    return x => a.reduceRight((y, fn) => fn(y), x);
  },
  composeLeft(...a) {
    return x => a.reduce((y, fn) => fn(y), x);
  },
  uniq(x) {
    return [...new Set(x)];
  },
  filterSplit(...a) {
    return (x) => a.reduce((acc, fn) =>
      acc.push(fn(x)) && acc, []);
  },
  flatten(a) {
    return a.reduce((acc, x) =>
      Array.isArray(x) ? acc.concat(flatten(x)) :
      acc.concat(x), []);
  },
  combine(a) {
    return a.reduce((acc, x) => acc.concat(x), []);
  }
};
