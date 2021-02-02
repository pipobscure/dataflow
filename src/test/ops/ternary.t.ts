import { describe, it } from '@xutl/test';
import should from 'should';

import * as Op from '../../lib/ops';
import { Source } from '../../lib/source';
import { Subscriptions } from '../../lib/subscriptions';

describe('binary perators', () => {
	const manager = new Subscriptions();
	it('Conditional', () => {
		const source = new Source(manager, false);
		const left = new Source(manager, 3);
		const right = new Source(manager, 5);
		const op = new Op.Conditional(manager);
		op.source.subscribe(source);
		op.left.subscribe(left);
		op.right.subscribe(right);

		source.value = true;
		should.equal(op.value, left.value);

		source.value = false;
		should.equal(op.value, right.value);
	});
	it('SubString', () => {
		const source = new Source(manager, 'hallo');
		const left = new Source(manager, 1);
		const right = new Source(manager, 4);
		const op = new Op.SubString(manager, source, left, right);
		should.equal(op.value, 'all');
	});
});
