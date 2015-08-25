import test from 'tape';
import fnutil from '../lib';
import { curry } from '../lib/core';
import { curry as curryDec } from '../lib/decorators';
import { map } from '../lib/utils';

test('All tools exist in package', t => {
	t.plan(3);
	t.notEqual(fnutil.core, undefined, 'Core is defined');
	t.notEqual(fnutil.decorators, undefined, 'Decorators are defined');
	t.notEqual(fnutil.utils, undefined, 'Utilities are defined');
});

test('Tools can be destructured', t => {
	t.plan(3);
	t.notEqual(curry, undefined, 'Curry is defined');
	t.notEqual(curryDec, undefined, 'Curry decorator is defined');
	t.notEqual(map, undefined, 'Curried map is defined');
});
