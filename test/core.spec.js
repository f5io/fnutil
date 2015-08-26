import test from 'tape';
import {
	compose,
	composeLeft,
	curry,
	curryRight,
	memoize
} from '../lib/core';

let minusTwo = x => x - 2;
let plusFour = x => x + 4;
let timesTwo = x => x * 2;
let toCurry = (x, y, z) => (x * y) + z;

test('[core] compose', t => {
	t.plan(1);
	let fn = compose(timesTwo, plusFour, minusTwo);
	t.equal(fn(9), 22, 'should reduce functions right to left');
});

test('[core] composeLeft', t => {
	t.plan(1);
	let fn = composeLeft(timesTwo, plusFour, minusTwo);
	t.equal(fn(9), 20, 'should reduce functions left to right');
});

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
	t.plan(1);
	let fn = memoize(toCurry);
	console.log(toCurry.length, fn.length);
	t.equal(fn.length, toCurry.length, 'should retain a function`s arity');
	// t.equal(fn(1, 2, 3), 5, 'should return the expected result');
	// t.equal(fn._cache().size, 1, 'should cache resulting calls');
});

