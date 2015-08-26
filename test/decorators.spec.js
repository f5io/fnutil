import test from 'tape';
import {
	curry,
	curryRight,
	memoize
} from '../lib/decorators';

test('[decorators] curry', t => {
	t.plan(1);
	let _ = {
		@curry
		fn(x, y, z) { return (x * y) + z; }
	};
	t.equal(_.fn(1)(2)(3), 5, 'should curry arguments left to right');
});

test('[decorators] curryRight', t => {
	t.plan(1);
	let _ = {
		@curryRight
		fn(x, y, z) { return (x * y) + z; }
	};
	t.equal(_.fn(3)(2)(1), 5, 'should curry arguments right to left');
});

test('[decorators] memoize', t => {
	t.plan(3);
	let _ = {
		@memoize
		fn(x, y, z) { return (x * y) + z; }
	}
	t.equal(_.fn.length, 3, 'should retain a function`s arity');
	t.equal(_.fn(1, 2, 3), 5, 'should return the expected result');
	t.equal(_.fn._cache().size, 1, 'should cache resulting calls');
});