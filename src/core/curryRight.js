export default function curryRight(fn, args = []) {
	return (...a) => {
		let x = a.concat(...args);
		return x.length >= fn.length ?
			fn(...x.slice(-fn.length)) :
			curryRight(fn, x);
	}
}