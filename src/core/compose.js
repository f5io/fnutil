export default function compose(...a) {
	return x => a.reduceRight((y, fn) => fn(y), x);
}