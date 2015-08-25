export default function curry(fn, args = []) {
	return (...a) => {
		let x = args.concat(...a);
		return x.length >= fn.length ?
			fn(...x) :
			curry(fn, x);
	}
}