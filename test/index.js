import test from 'tape';
import lib from '../lib';
import { curry } from '../lib/core';
import { curry as curryDec } from '../lib/decorators';
import { map } from '../lib/utils';

test('All tools exist in package', t => {
	t.plan(3);
	t.ok(lib.core, 'Core is defined');
	t.ok(lib.decorators, 'Decorators are defined');
	t.ok(lib.utils, 'Utilities are defined');
});

test('Tools can be destructured', t => {
	t.plan(3);
	t.ok(curry, 'Curry is defined');
	t.ok(curryDec, 'Curry decorator is defined');
	t.ok(map, 'Curried map is defined');
});
