import type { TargetInterface } from './target';
import type { Source } from './source';

export interface DeliverInterface {
	deliver(source: Source<any>): void;
	transact(action: () => void): void;
}
export interface SubscribeInterface {
	subscribe<DataType>(source: Source<DataType>, target: TargetInterface<DataType>): Subscription<DataType>;
	unsubscribe<DataType>(subscription: Subscription<DataType>): void;
	subscribed<DataType>(source: Source<DataType>): boolean;
}
export class Subscriptions implements DeliverInterface, SubscribeInterface {
	#subscriptions: SubscriptionMap = new SubscriptionMap();
	#deliveries: Set<Source<unknown>> = new Set();
	#delivering: boolean = false;
	#paused?: symbol;
	deliver(source?: Source<unknown>) {
		if (source) this.#deliveries.add(source);
		if (this.#delivering || this.#paused) return;
		this.#delivering = true;
		for (const source of this.#deliveries) {
			const subs = this.#subscriptions.get(source);
			for (const sub of subs) sub.deliver();
			this.#deliveries.delete(source);
		}
		this.#delivering = false;
		if (this.#deliveries.size) this.deliver();
	}
	transact(action: () => void): void {
		const token = (this.#paused = this.#paused || Symbol('pause'));
		if (token === this.#paused) this.#deliveries.clear();
		try {
			action();
		} finally {
			if (token === this.#paused) {
				this.#paused = undefined;
			}
			this.deliver();
		}
	}
	subscribe<DataType>(source: Source<DataType>, target: TargetInterface<DataType>) {
		const sub = new Subscription(source, target);
		this.#subscriptions.set(source, sub);
		return sub;
	}
	unsubscribe<DataType>(subscription: Subscription<DataType>) {
		if (this.#subscriptions.has(subscription.source)) {
			this.#subscriptions.delete(subscription.source, subscription);
		}
	}
	subscribed<DataType>(source: Source<DataType>): boolean {
		return this.#subscriptions.has(source);
	}
}

class SubscriptionMap {
	#data: WeakMap<Source<unknown>, Set<Subscription<unknown>>> = new WeakMap();
	set<DataType>(source: Source<DataType>, subscription: Subscription<DataType>) {
		if (!this.#data.has(source)) this.#data.set(source, new Set());
		const set = this.#data.get(source) as Set<Subscription<DataType>>;
		set.add(subscription);
	}
	has<DataType>(source: Source<DataType>): boolean {
		return this.#data.has(source);
	}
	get<DataType>(source: Source<DataType>): Set<Subscription<DataType>> {
		return (this.#data.get(source) || new Set()) as Set<Subscription<DataType>>;
	}
	delete<DataType>(source: Source<DataType>, subscription: Subscription<DataType>) {
		const set = this.#data.get(source) as Set<Subscription<unknown>>;
		set.delete(subscription);
		if (!set.size) this.#data.delete(source);
	}
}

export class Subscription<DataType> {
	#source: Source<DataType>;
	#target: TargetInterface<DataType>;
	constructor(source: Source<DataType>, target: TargetInterface<DataType>) {
		this.#source = source;
		this.#target = target;
	}
	get source(): Source<DataType> {
		return this.#source;
	}
	deliver() {
		this.#target.value = this.#source.value;
	}
}
