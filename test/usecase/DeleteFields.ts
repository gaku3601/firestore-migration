import { assert } from 'chai';
import DeleteFields from '@/usecase/DeleteFields';
import Param from '@/domain/Param';
import { Document } from '@/domain/Document';
import IRepository from '@/usecase/IRepository';

class Test implements IRepository {
    public CollectionGroup2(collection: string): Promise<Document[]> {
        throw new Error('Method not implemented.');
    }
    public Update2(documentPath: string, Params: Param[], operation: string): void {
        throw new Error('Method not implemented.');
    }
}

describe('DeleteFields class', () => {
    it('validationでparamsにnameが格納されていない場合、エラーが例外として出力されること', () => {
        assert.throw(() => {
            const db = new Test();
            // tslint:disable-next-line
            new DeleteFields(db, 'test', [new Param()]);
        }, 'params[name]に値が設定されていません。');
    });
});
