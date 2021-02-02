import { describe, it, before } from '@xutl/test';
import sinon from 'sinon';
import should from 'should';

import { Source } from '../lib/source';

describe('source', () => {
	const manager = {
		deliver: sinon.stub(),
		transact: (c: () => void) => c(),
	};
	const source = new Source<number>(manager);
	it('starts as undefined', () => should.equal(source.value, undefined));
	describe('setting value 0', () => {
		before(() => {
			manager.deliver.reset();
			source.value = 0;
		});
		it('deliver was called once', () => should.equal(manager.deliver.callCount, 1));
		it('deliver call args', () => should.equal((manager.deliver.args[0] as any[])[0], source));
		it('value is 0', () => should.equal(source.value, 0));
	});
	describe('setting value 1', () => {
		before(() => {
			manager.deliver.reset();
			source.value = 1;
		});
		it('deliver was called once', () => should.equal(manager.deliver.callCount, 1));
		it('deliver call args', () => should.equal((manager.deliver.args[0] as any[])[0], source));
		it('value is 1', () => should.equal(source.value, 1));
	});
	describe('setting value undefined', () => {
		before(() => {
			manager.deliver.reset();
			source.value = undefined;
		});
		it('deliver was called once', () => should.equal(manager.deliver.callCount, 1));
		it('deliver call args', () => should.equal((manager.deliver.args[0] as any[])[0], source));
		it('value is undefined', () => should.equal(source.value, undefined));
	});
});
