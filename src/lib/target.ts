import type { SubscribeInterface, Subscription } from './subscriptions';
import type { Source } from './source';

export interface TargetInterface<DataType> {
	value?: DataType;
	subscribe(source: Source<DataType>): void;
	unsubscribe(reatin?: boolean): void;
}
export interface TargetCallback<DataType> {
	(target: Target<DataType>, value: DataType | undefined): void;
}
const KEY = Symbol('key');

export class Target<DataType> implements TargetInterface<DataType> {
	#subscriber: SubscribeInterface;
	#callback?: TargetCallback<DataType>;
	constructor(key: typeof KEY, subscriber: SubscribeInterface, callback?: TargetCallback<DataType>, source?: Source<DataType>) {
		if (key !== KEY) throw new TypeError('construct via static factory methods');
		this.#subscriber = subscriber;
		this.#callback = callback;
		if (source) this.subscribe(source);
	}
	#value?: DataType;
	get value() {
		return this.#value;
	}
	set value(value: DataType | undefined) {
		if (value === this.#value) return;
		this.#value = value;
		this.#callback && this.#callback(this, value);
	}
	#subscription?: Subscription<DataType>;
	subscribe(source: Source<DataType>) {
		if (this.#subscription) this.#subscriber.unsubscribe(this.#subscription);
		this.#subscription = this.#subscriber.subscribe(source, this);
		this.value = source.value;
	}
	unsubscribe(retain: boolean = true) {
		if (this.#subscription) this.#subscriber.unsubscribe(this.#subscription);
		this.#subscription = undefined;
		if (!retain) {
			this.value = undefined;
		}
	}
	static callback<Type>(subscriber: SubscribeInterface, callback: TargetCallback<Type>, source?: Source<Type>): Target<Type> {
		return new Target(KEY, subscriber, callback, source);
	}
	static external<ReceiverType, PropName extends keyof ReceiverType>(subscriber: SubscribeInterface, receiver: ReceiverType, property: PropName, source?: Source<ReceiverType[PropName]>): Target<ReceiverType[PropName]> {
		return new Target(KEY, subscriber, (_: Target<ReceiverType[PropName]>, value: ReceiverType[PropName] | undefined) => (value !== undefined ? (receiver[property] = value) : receiver[property]), source);
	}
}
