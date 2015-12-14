export default function create(fn) {
	return function(target, key, descriptor) {
		return {
			...descriptor,
			value: fn(descriptor.value)
		}
	}
}
