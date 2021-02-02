import { DeliverInterface, SubscribeInterface } from '../subscriptions';
import { Source } from '../source';
import { Target } from '../target';

interface Unary<DataType, SourceType = DataType> {
	(value: SourceType | undefined): DataType | undefined;
}
export class Transform<ResultType, SourceType = ResultType> extends Source<ResultType> {
	// @ts-expect-error
	#source: Target<SourceType>;
	constructor(manager: DeliverInterface & SubscribeInterface, calculate: Unary<ResultType, SourceType>, source?: Source<SourceType>) {
		super(manager);
		const callback = () => (this.value = calculate(this.#source?.value));
		manager.transact(() => {
			this.#source = Target.callback(manager, callback, source);
			callback();
		});
	}
	get input(): Target<SourceType> {
		return this.#source;
	}
}

export class Not extends Transform<boolean, any> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value) => !value, source);
	}
}

export class ToBoolean extends Transform<boolean, any> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value) => !!value, source);
	}
}
export class ToString extends Transform<string, any> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value) => `${value ? value.toString() : value}`, source);
	}
}
export class ToNumber extends Transform<number, any> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value) => +value, source);
	}
}

export class Trim extends Transform<string> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<string>) {
		super(manager, (value = '') => value.trim(), source);
	}
}
export class UpperCase extends Transform<string> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value = '') => value.toUpperCase(), source);
	}
}
export class LowerCase extends Transform<string> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value = '') => value.toLowerCase(), source);
	}
}
export class Length extends Transform<number, string> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value = '') => value.length, source);
	}
}

export class Round extends Transform<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value = 0) => Math.round(value), source);
	}
}
export class Floor extends Transform<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value = 0) => Math.floor(value), source);
	}
}
export class Ceil extends Transform<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<any>) {
		super(manager, (value = 0) => Math.ceil(value), source);
	}
}
