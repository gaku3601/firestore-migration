import addFields from '@/usecase/addFields';
import { assert } from 'chai';

describe('addFields class', () => {
    it('collectionとparamsが設定されること', () => {
        const a = new addFields('test', [{name: '', if: '', value: '', to: '', aggCollection: '', aggField: ''}]);
        assert.deepEqual(a.Collection, 'test');
        assert.deepEqual(a.Params, [{name: '', if: '', value: '', to: '', aggCollection: '', aggField: ''}]);
    });
});
