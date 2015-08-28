import test from 'tape';
import lib from '../lib';
import {
	curry,
	compose
} from '../lib/core';
import {
	filter,
	filterNot,
	filterSplit,
	flatten,
	combine,
	map,
	reduce,
	sort,
	uniq
} from '../lib/utils';
import { curry as curryDec } from '../lib/decorators';

const data = Array.from({ length: 10 }, (v, k) => ++k);

let divisibleByTwo = filter(x => x % 2 === 0);
let divisibleByThree = filter(x => x % 3 === 0);

test('[lib] all tools exist in package', t => {
	t.plan(3);
	t.ok(lib.core, 'lib.core should be defined');
	t.ok(lib.decorators, 'lib.decorators should be defined');
	t.ok(lib.utils, 'lib.utils should be defined');
});

test('[lib] tools can be destructured', t => {
	t.plan(3);
	t.ok(curry, 'curry should be defined');
	t.ok(curryDec, 'curry decorator should be defined');
	t.ok(map, 'curried map should be defined');
});

test('[lib] composing some functions', t => {
	t.plan(1);
	let fn = compose(
		filter(x => x < 10),
		map(x => x * 2),
		sort((a, b) => a - b),
		combine,
		filterSplit(divisibleByTwo, divisibleByThree)
	);
	t.deepEqual(fn(data), [4, 6, 8], 'should output correct value');
});

test('[lib] large complex compose', t => {
	t.plan(1);
	let fn = compose(
		uniq,
		combine,
		filterSplit(
			compose(
				sort((a, b) => b - a),
				map(x => (x / 2) + 5),
				divisibleByTwo
			),
			compose(
				map(x => x * 2),
				divisibleByThree
			)
		),
		map(x => x * 5)
	);
	t.deepEqual(fn(data), [30, 25, 20, 15, 10, 60, 90], 'should output correct value');
});
