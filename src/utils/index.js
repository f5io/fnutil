import { curry } from '../decorators';

const flatten = a =>
  a.reduce((acc, x) =>
      Array.isArray(x) ? acc.concat(flatten(x)) :
      acc.concat(x), []);

const utils = {
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
    return [...x].sort(fn);
  },
  @curry
  spread(fn, x) {
    return fn(...x);
  },
  @curry
  split(by, x) {
    return x.split(by);
  },
  head(x) {
    return x[0];
  },
  tail(x) {
    return x[x.length - 1];
  },
  reverse(x) {
    return [...x].reverse();
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
  combine(a) {
    return a.reduce((acc, x) => acc.concat(x), []);
  },
  flatten
}

const {
  filter, filterNot, map, reduce,
  concat, sort, spread, split, head,
  tail, reverse, compose, composeLeft,
  uniq, filterSplit, combine
} = utils;

export {
  filter, filterNot, map, reduce,
  concat, sort, spread, split, head,
  tail, reverse, compose, composeLeft,
  uniq, filterSplit, combine, flatten
};
export default utils;
