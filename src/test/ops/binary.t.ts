import { describe, it } from '@xutl/test';
import should from 'should';

import * as Op from '../../lib/ops';
import { Source } from '../../lib/source';
import { Subscriptions } from '../../lib/subscriptions';

describe('binary perators', () => {
	const manager = new Subscriptions();

	it('Addition', () => {
		const left = new Source(manager, 0);
		const right = new Source(manager, 0);
		const op = new Op.Addition(manager);
		op.left.subscribe(left);
		op.right.subscribe(right);
		new Array(10)
			.fill(0)
			.map(() => [Math.random() * 1e2, Math.random() * 1e3])
			.forEach(([l, r]) => {
				left.value = l;
				right.value = r;
				should.equal(op.value, (l ?? 0) + (r ?? 0));
			});
	});
	it('Subtraction', () => {
		const left = new Source(manager, 0);
		const right = new Source(manager, 0);
		const op = new Op.Subtraction(manager, left, right);
		new Array(10)
			.fill(0)
			.map(() => [Math.random() * 1e2, Math.random() * 1e3])
			.forEach(([l, r]) => {
				left.value = l;
				right.value = r;
				should.equal(op.value, (l ?? 0) - (r ?? 0));
			});
	});
	it('Multiplication', () => {
		const left = new Source(manager, 0);
		const right = new Source(manager, 0);
		const op = new Op.Multiplication(manager, left, right);
		new Array(10)
			.fill(0)
			.map(() => [Math.random() * 1e2, Math.random() * 1e3])
			.forEach(([l, r]) => {
				left.value = l;
				right.value = r;
				should.equal(op.value, (l ?? 0) * (r ?? 0));
			});
	});
	it('Division', () => {
		const left = new Source(manager, 0);
		const right = new Source(manager, 0);
		const op = new Op.Division(manager, left, right);
		new Array(10)
			.fill(0)
			.map(() => [Math.random() * 1e2, 1 + Math.random() * 1e3])
			.forEach(([l, r]) => {
				left.value = l;
				right.value = r;
				should.equal(op.value, (l ?? 0) / (r ?? 0));
			});
	});
	it('Modulus', () => {
		const left = new Source(manager, 0);
		const right = new Source(manager, 0);
		const op = new Op.Modulus(manager, left, right);
		new Array(10)
			.fill(0)
			.map(() => [Math.random() * 1e2, 1 + Math.random() * 1e3])
			.forEach(([l, r]) => {
				left.value = l;
				right.value = r;
				should.equal(op.value, (l ?? 0) % (r ?? 0));
			});
	});
	it('Exponent', () => {
		const left = new Source(manager, 0);
		const right = new Source(manager, 0);
		const op = new Op.Exponent(manager, left, right);
		new Array(10)
			.fill(0)
			.map(() => [Math.random() * 1e2, Math.random() * 1e3])
			.forEach(([l, r]) => {
				left.value = l;
				right.value = r;
				should.equal(op.value, (l ?? 0) ** (r ?? 0));
			});
	});
	it('Concatenation', () => {
		const left = new Source(manager, 0);
		const right = new Source(manager, 0);
		const op = new Op.Concatenation(manager, left, right);
		new Array(10)
			.fill(0)
			.map(() => [Math.random() * 1e2, Math.random() * 1e3])
			.forEach(([l, r]) => {
				left.value = l;
				right.value = r;
				should.equal(op.value, `${l}${r}`);
			});
	});
	it('Index', () => {
		const left = new Source(manager, 'hallo');
		const right = new Source(manager, 'l');
		const op = new Op.Index(manager, left, right);
		should.equal(op.value, 2);
	});
	it('LogicalAnd', () => {
		const left = new Source(manager, false);
		const right = new Source(manager, false);
		const op = new Op.LogicalAnd(manager, left, right);
		[
			[false, false],
			[false, true],
			[true, false],
			[true, true],
		].forEach(([l, r]) => {
			left.value = l;
			right.value = r;
			should.equal(op.value, l && r);
		});
	});
	it('LogicalOr', () => {
		const left = new Source(manager, false);
		const right = new Source(manager, false);
		const op = new Op.LogicalOr(manager, left, right);
		[
			[false, false],
			[false, true],
			[true, false],
			[true, true],
		].forEach(([l, r]) => {
			left.value = l;
			right.value = r;
			should.equal(op.value, l || r);
		});
	});
	it('LogicalXor', () => {
		const left = new Source(manager, false);
		const right = new Source(manager, false);
		const op = new Op.LogicalXor(manager, left, right);
		[
			[false, false],
			[false, true],
			[true, false],
			[true, true],
		].forEach(([l, r]) => {
			left.value = l;
			right.value = r;
			should.equal(op.value, (l || r) && !(l && r));
		});
	});
});
