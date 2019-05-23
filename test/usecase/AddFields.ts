import addFields from '@/usecase/AddFields';
import { assert } from 'chai';
import IRepository from '@/usecase/IRepository';
import { Document } from '@/domain/Document';
import Param from '@/domain/Param';

class Test implements IRepository {
    public CollectionGroup2(collection: string): Promise<Document[]> {
        throw new Error('Method not implemented.');
    }
    public Update2(documentPath: string, Params: Param[], operation: string): void {
        throw new Error('Method not implemented.');
    }
}

describe('addFields class', () => {
    const repo = new Test();
    it('paramsに必要なnameに値がされていない場合、errorが例外として投げられること', () => {
        assert.throw(() => {
            // tslint:disable-next-line
            new addFields(repo, 'test', [{name: '', if: '', value: 'aaa', to: '', aggCollection: '', aggField: ''}]);
        }, 'params[name]に値が設定されていません。');
    });
    it('paramsに必要なvalueに値が設定されていない場合、errorが例外として投げられること', () => {
        assert.throw(() => {
            // tslint:disable-next-line
            new addFields(repo, 'test', [{name: 'aaa', if: '', value: '', to: '', aggCollection: '', aggField: ''}]);
        }, 'params[value]に値が設定されていません。');
    });
});
