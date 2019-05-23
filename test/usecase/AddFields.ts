import addFields from '@/usecase/AddFields';
import { assert } from 'chai';

describe('addFields class', () => {
    it('paramsに必要なnameに値がされていない場合、errorが例外として投げられること', () => {
        assert.throw(() => {
            // tslint:disable-next-line
            new addFields('test', [{name: '', if: '', value: 'aaa', to: '', aggCollection: '', aggField: ''}]);
        }, 'params[name]に値が設定されていません。');
    });
    it('paramsに必要なvalueに値が設定されていない場合、errorが例外として投げられること', () => {
        assert.throw(() => {
            // tslint:disable-next-line
            new addFields('test', [{name: 'aaa', if: '', value: '', to: '', aggCollection: '', aggField: ''}]);
        }, 'params[value]に値が設定されていません。');
    });
});
