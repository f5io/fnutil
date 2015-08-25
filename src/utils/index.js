import { curry } from '../decorators';

export default {
	@curry
	map(fn, x) {
		return x.map(fn);
	},
	@curry
	filter(fn, x) {
		return x.filter(fn)
	},
	@curry
	reduce(fn, y, x) {
		return x.reduce(fn, y);
	}
}
