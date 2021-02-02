import { describe, it } from '@xutl/test';
import sinon from 'sinon';
import should from 'should';

import { Subscriptions } from '../lib/subscriptions';
import { Source } from '../lib/source';
import { Target } from '../lib/target';

describe('target', () => {
	const subscriber = new Subscriptions();
	it('construction should fail', () =>
		should.throws(() => {
			//@ts-expect-error
			console.error(new Target(Symbol('dummy'), subscriber, () => {}));
		}));
	describe('callback', () => {
		const callback = sinon.fake();
		const target = Target.callback<number>(subscriber, callback);
		it('inital value undefined', () => should.equal(target.value, undefined));
		it('setting to 1', () => should.equal((target.value = 1), 1));
		it('callback called(target, 1)', () => should.ok(callback.calledOnceWith(target, 1)));
		it('setting to 1', () => should.equal((target.value = 1), 1));
		it('callback still called(target, 1)', () => should.ok(callback.calledOnceWith(target, 1)));
	});
	describe('external', () => {
		const receiver: { prop?: number } = { prop: 0 };
		const target = Target.external(subscriber, receiver as { prop: number }, 'prop');
		it('inital value undefined', () => {
			should.equal(target.value, undefined);
			should.equal(receiver.prop, 0);
		});
		it('setting to 1', () => {
			target.value = 1;
			should.equal(receiver.prop, 1);
		});
		it('setting to 2', () => {
			target.value = 2;
			should.equal(receiver.prop, 2);
		});
		it('setting to 3', () => {
			target.value = 3;
			should.equal(receiver.prop, 3);
		});
	});
	describe('subscription', () => {
		const receiver: { prop?: number } = { prop: -1 };
		const target = Target.external(subscriber, receiver as { prop: number }, 'prop');
		const source = new Source(subscriber, 0);

		it('inital value undefined', () => {
			should.equal(source.value, 0);
			should.equal(target.value, undefined);
			should.equal(receiver.prop, -1);
		});
		it('subscribe', () => {
			target.subscribe(source);
			should.equal(source.value, 0);
			should.equal(target.value, 0);
			should.equal(receiver.prop, 0);
		});
		it('setting to 1', () => {
			source.value = 1;
			should.equal(source.value, 1);
			should.equal(target.value, 1);
			should.equal(receiver.prop, 1);
		});
		it('setting to 2', () => {
			source.value = 2;
			should.equal(source.value, 2);
			should.equal(target.value, 2);
			should.equal(receiver.prop, 2);
		});
		it('setting to 3', () => {
			source.value = 3;
			should.equal(source.value, 3);
			should.equal(target.value, 3);
			should.equal(receiver.prop, 3);
		});
		it('subscribe: 1', () => {
			target.subscribe(source);
			should.equal(subscriber.subscribed(source), true);
			source.value = 4;
			target.unsubscribe(false);
			should.equal(subscriber.subscribed(source), false);
			source.value = 5;
			should.equal(source.value, 5);
			should.equal(target.value, undefined);
			should.equal(receiver.prop, 4);
		});
		it('subscribe: 2', () => {
			target.subscribe(source);
			source.value = 5;
			target.unsubscribe(true);
			source.value = 6;
			should.equal(source.value, 6);
			should.equal(target.value, 5);
			should.equal(receiver.prop, 5);
		});
		it('subscribe: 3', () => {
			target.subscribe(source);
			source.value = 6;
			target.unsubscribe();
			source.value = 7;
			should.equal(source.value, 7);
			should.equal(target.value, 6);
			should.equal(receiver.prop, 6);
		});
	});
	describe('multiple subscriptions', () => {
		const receiver1: { prop?: number } = { prop: -1 };
		const target1 = Target.external(subscriber, receiver1 as { prop: number }, 'prop');
		const receiver2: { prop?: number } = { prop: -1 };
		const target2 = Target.external(subscriber, receiver2 as { prop: number }, 'prop');
		const source = new Source(subscriber, 0);
		target1.subscribe(source);
		target2.subscribe(source);
		it('initial value 0', () => {
			should.equal(receiver1.prop, 0);
			should.equal(receiver2.prop, 0);
		});
		it('set value 1', () => {
			source.value = 1;
			should.equal(receiver1.prop, 1);
			should.equal(receiver2.prop, 1);
		});
		it('one unsub', () => {
			should.equal(receiver1.prop, 1);
			should.equal(receiver2.prop, 1);
			target1.unsubscribe();
			source.value = 2;
			should.equal(receiver1.prop, 1);
			should.equal(receiver2.prop, 2);
		});
		it('two unsub', () => {
			should.equal(receiver1.prop, 1);
			should.equal(receiver2.prop, 2);
			target2.unsubscribe();
			source.value = 3;
			should.equal(receiver1.prop, 1);
			should.equal(receiver2.prop, 2);
		});
	});
});
