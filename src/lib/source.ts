import { DeliverInterface } from './subscriptions';

export class Source<DataType> {
	#manager: DeliverInterface;
	#value?: DataType;
	constructor(manager: DeliverInterface, initial?: DataType) {
		this.#manager = manager;
		this.#value = initial;
	}
	get value(): DataType | undefined {
		return this.#value;
	}
	set value(val: DataType | undefined) {
		if (this.#value === val) return;
		this.#value = val;
		this.#manager.deliver(this);
	}
}
