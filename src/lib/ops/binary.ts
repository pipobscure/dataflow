import { DeliverInterface, SubscribeInterface } from '../subscriptions';
import { Source } from '../source';
import { Target } from '../target';

interface Binary<DataType, LeftType = DataType, RightType = DataType> {
	(left: LeftType | undefined, right: RightType | undefined): DataType | undefined;
}
export class Combination<ResultType, LeftType = ResultType, RightType = ResultType> extends Source<ResultType> {
	// @ts-expect-error
	#left: Target<LeftType>;
	// @ts-expect-error
	#right: Target<RightType>;
	constructor(manager: DeliverInterface & SubscribeInterface, calculate: Binary<ResultType, LeftType, RightType>, left?: Source<LeftType>, right?: Source<RightType>) {
		super(manager);
		const callback = () => (this.value = calculate(this.#left?.value, this.#right?.value));
		manager.transact(() => {
			this.#left = Target.callback(manager, callback, left);
			this.#right = Target.callback(manager, callback, right);
			callback();
		});
	}
	get left(): Target<LeftType> {
		return this.#left;
	}
	get right(): Target<RightType> {
		return this.#right;
	}
}

export class Addition extends Combination<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<number>, right?: Source<number>) {
		super(manager, (left = 0, right = 0) => left + right, left, right);
	}
}
export class Subtraction extends Combination<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<number>, right?: Source<number>) {
		super(manager, (left = 0, right = 0) => left - right, left, right);
	}
}
export class Multiplication extends Combination<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<number>, right?: Source<number>) {
		super(manager, (left = 0, right = 0) => left * right, left, right);
	}
}
export class Division extends Combination<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<number>, right?: Source<number>) {
		super(manager, (left = 0, right = 1) => left / right, left, right);
	}
}
export class Modulus extends Combination<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<number>, right?: Source<number>) {
		super(manager, (left = 0, right = 1) => left % right, left, right);
	}
}
export class Exponent extends Combination<number> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<number>, right?: Source<number>) {
		super(manager, (left = 0, right = 1) => left ** right, left, right);
	}
}

export class Concatenation extends Combination<string, any, any> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<any>, right?: Source<any>) {
		super(manager, (left = '', right = '') => `${left}${right}`, left, right);
	}
}
export class Index extends Combination<number, string, string> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<string>, right?: Source<string>) {
		super(manager, (left = '', right = '') => left.indexOf(right), left, right);
	}
}

export class LogicalAnd extends Combination<boolean> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<boolean>, right?: Source<boolean>) {
		super(manager, (left = false, right = false) => left && right, left, right);
	}
}
export class LogicalOr extends Combination<boolean> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<boolean>, right?: Source<boolean>) {
		super(manager, (left = false, right = false) => left || right, left, right);
	}
}
export class LogicalXor extends Combination<boolean> {
	constructor(manager: DeliverInterface & SubscribeInterface, left?: Source<boolean>, right?: Source<boolean>) {
		super(manager, (left = false, right = false) => (left || right) && !(left && right), left, right);
	}
}
