export default function composeLeft(...a) {
	return x => a.reduce((y, fn) => fn(y), x);
}