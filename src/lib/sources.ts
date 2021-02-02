import { Subscriptions } from './subscriptions';
import { Source } from './source';

export class Sources {
	#subscriptions: Subscriptions;
	#sources: Map<string, WeakRef<Source<unknown>>> = new Map();
	constructor(subscriptions: Subscriptions = new Subscriptions()) {
		this.#subscriptions = subscriptions;
	}
	get subscriptions() {
		return this.#subscriptions;
	}
	get<T = unknown>(id: string): Source<T> | undefined {
		const src = this.#sources.get(id)?.deref();
		if (!src) this.#sources.delete(id);
		return src as Source<T> | undefined;
	}
	source<T>(id: string, value: T): Source<T> {
		let src = this.get<T>(id);
		if (src) return src;
		src = new Source(this.#subscriptions, value);
		this.#sources.set(id, new WeakRef(src));
		return src;
	}
	clean() {
		for (const [id, ref] of this.#sources) {
			if (!ref.deref()) this.#sources.delete(id);
		}
	}
	static onmessage(sources: Sources) {
		return onmessage.bind(sources);
	}
}

function onmessage(this: Sources, evt: MessageEvent): void {
	try {
		const data = JSON.parse(evt.data);
		const { source, value } = data;
		if (source === undefined || value === undefined) return;
		const src = this.get<any>(source);
		if (!src) return;
		src.value = value;
	} catch (err) {
		// Ignore
	}
}
