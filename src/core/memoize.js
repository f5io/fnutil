export function memoize(fn) {
	let cache = new Map();
	let memo = (...a) => {
		let key = a.reduce((hash, val) =>
			hash += val === Object(val) ?
				JSON.stringify(val) :
				val, '');
		if (!cache.has(key)) cache.set(key, fn(...a));
		return cache.get(key);
	}
	return Object.defineProperties(memo, {
		length: { value: fn.length },
		_cache: { value: () => cache }
	});
}

export default memoize;
