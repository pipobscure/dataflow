import { DeliverInterface, SubscribeInterface } from '../subscriptions';
import { Source } from '../source';
import { Target } from '../target';

interface Ternary<DataType, SourceType = DataType, LeftType = SourceType, RightType = SourceType> {
	(cond: SourceType | undefined, left: LeftType | undefined, right: RightType | undefined): DataType | undefined;
}

export class Expression<ResultType, SourceType = boolean, LeftType = ResultType, RightType = ResultType> extends Source<ResultType> {
	//@ts-expect-error
	#source: Target<SourceType>;
	//@ts-expect-error
	#left: Target<LeftType>;
	//@ts-expect-error
	#right: Target<RightType>;
	constructor(manager: DeliverInterface & SubscribeInterface, calculate: Ternary<ResultType, SourceType, LeftType, RightType>, source?: Source<SourceType>, left?: Source<LeftType>, right?: Source<RightType>) {
		super(manager);
		const callback = () => (this.value = calculate(this.#source?.value, this.#left?.value, this.#right?.value));
		manager.transact(() => {
			this.#source = Target.callback(manager, callback, source);
			this.#left = Target.callback(manager, callback, left);
			this.#right = Target.callback(manager, callback, right);
			callback();
		});
	}
	get source(): Target<SourceType> {
		return this.#source;
	}
	get left(): Target<LeftType> {
		return this.#left;
	}
	get right(): Target<RightType> {
		return this.#right;
	}
}

export class Conditional<ResultType> extends Expression<ResultType> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<boolean>, left?: Source<ResultType>, right?: Source<ResultType>) {
		super(manager, (cond, left, right) => (!!cond ? left : right), source, left, right);
	}
}

export class SubString extends Expression<string, string, number, number> {
	constructor(manager: DeliverInterface & SubscribeInterface, source?: Source<string>, left?: Source<number>, right?: Source<number>) {
		super(manager, (str = '', left = 0, right = 0) => str.substring(left, right), source, left, right);
	}
}
