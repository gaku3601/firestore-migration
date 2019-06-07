import { assert } from 'chai';
import DeleteFields from '@/usecase/migrate/DeleteFields';
import Param from '@/domain/Param';
import { Document, Operation } from '@/domain/Document';
import IRepository from '@/usecase/migrate/IRepository';

class Test implements IRepository {
    public doc!: Document;
    public async CollectionGroup(collection: string): Promise<Document[]> {
        const docs: Document[] = [];
        docs.push(new Document('path1', {name: 'gaku', age: 27, sex: 0}));
        docs.push(new Document('path2', {name: 'gakuko', age: 20, sex: 1}));
        docs.push(new Document('path3', {name: 'gakuzo', age: 30, sex: 0}));
        return docs;
    }
    public Update(doc: Document): void {
        this.doc = doc;
    }
    // tslint:disable-next-line
    public Set(doc: Document): void {
    }
}

describe('DeleteFields class', () => {
    it('validationでparamsにnameが格納されていない場合、エラーが例外として出力されること', () => {
        assert.throw(() => {
            const db = new Test();
            // tslint:disable-next-line
            new DeleteFields(db, 'test', [new Param()], '');
        }, 'params[name]に値が設定されていません。');
    });
    describe('削除処理を実施する', () => {
        const param = new Param();
        param.name = 'sex';
        const db = new Test();
        const del = new DeleteFields(db, 'test', [param], '');
        del.StartMigration();
        it('sexに削除フラグを立てた状態で更新関数にデータが渡されていること', () => {
            assert.deepEqual(db.doc.Datas, {sex: Operation.Delete});
        });
    });
});
