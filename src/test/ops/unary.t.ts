import { describe, it } from '@xutl/test';
import should from 'should';

import * as Op from '../../lib/ops';
import { Source } from '../../lib/source';
import { Subscriptions } from '../../lib/subscriptions';

describe('unary perators', () => {
	const manager = new Subscriptions();
	it('Not', () => {
		const source = new Source(manager, false);
		const op = new Op.Not(manager);
		op.input.subscribe(source);
		should.equal(op.value, true);
		source.value = true;
		should.equal(op.value, false);
		source.value = false;
		should.equal(op.value, true);
		op.input.unsubscribe();
	});
	it('ToBoolean', () => {
		const source = new Source<any>(manager, false);
		const op = new Op.ToBoolean(manager, source);
		[true, false, 0, 1, 'str', '', {}].forEach((val) => {
			source.value = val;
			should.equal(op.value, !!val);
		});
	});
	it('ToString', () => {
		const source = new Source<any>(manager, false);
		const op = new Op.ToString(manager, source);
		[true, false, 0, 1, 'str', '', {}].forEach((val) => {
			source.value = val;
			should.equal(op.value, `${val}`);
		});
	});
	it('ToNumber', () => {
		const source = new Source<any>(manager, false);
		const op = new Op.ToNumber(manager, source);
		[true, false, 0, 1, '0', '2', '5.4'].forEach((val) => {
			source.value = val;
			should.equal(op.value, +val);
		});
	});
	it('Trim', () => {
		const source = new Source<any>(manager, '');
		const op = new Op.Trim(manager, source);
		source.value = ' hallo ';
		should.equal(op.value, 'hallo');
	});
	it('UpperCase', () => {
		const source = new Source<any>(manager, '');
		const op = new Op.UpperCase(manager);
		op.input.subscribe(source);
		source.value = 'hallo';
		should.equal(op.value, 'HALLO');
	});
	it('LowerCase', () => {
		const source = new Source<any>(manager, '');
		const op = new Op.LowerCase(manager);
		op.input.subscribe(source);
		source.value = 'Hallo';
		should.equal(op.value, 'hallo');
	});
	it('Length', () => {
		const source = new Source<any>(manager, '');
		const op = new Op.Length(manager);
		op.input.subscribe(source);
		source.value = 'hallo';
		should.equal(op.value, 5);
	});
	it('Round', () => {
		const source = new Source<number>(manager, 0);
		const op = new Op.Round(manager);
		op.input.subscribe(source);
		source.value = 5.4;
		should.equal(op.value, 5);
		source.value = 5.5;
		should.equal(op.value, 6);
		source.value = 5.7;
		should.equal(op.value, 6);
	});
	it('Floor', () => {
		const source = new Source<number>(manager, 0);
		const op = new Op.Floor(manager);
		op.input.subscribe(source);
		source.value = 5.4;
		should.equal(op.value, 5);
		source.value = 5.5;
		should.equal(op.value, 5);
		source.value = 5.7;
		should.equal(op.value, 5);
	});
	it('Ceil', () => {
		const source = new Source<number>(manager, 0);
		const op = new Op.Ceil(manager);
		op.input.subscribe(source);
		source.value = 5.4;
		should.equal(op.value, 6);
		source.value = 5.5;
		should.equal(op.value, 6);
		source.value = 5.7;
		should.equal(op.value, 6);
	});
});
