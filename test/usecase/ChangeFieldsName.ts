import { assert } from 'chai';
import ChangeFieldsName from '@/usecase/ChangeFieldsName';
import Param from '@/domain/Param';
import IRepository from '@/usecase/IRepository';
import { Document, Operation } from '@/domain/Document';

class TestDB implements IRepository {
    public Docs: Document[] = [];
    public async CollectionGroup2(collection: string): Promise<Document[]> {
        const docs: Document[] = [];
        docs.push(new Document('path1', {name: 'gaku', age: 27, sex: 0}));
        docs.push(new Document('path2', {name: 'gakuko', age: 20, sex: 1}));
        docs.push(new Document('path3', {name: 'gakuzo', age: 30, sex: 0}));
        return docs;
    }
    public Update2(doc: Document): void {
        this.Docs.push(doc);
    }
}

describe('ChangeFieldsNameClass', () => {
    it('validationでparamsにnameが格納されていない場合、エラーが例外として出力されること', () => {
        assert.throw(() => {
            const db = new TestDB();
            const param = new Param();
            param.to = 'test';
            // tslint:disable-next-line
            new ChangeFieldsName(db, '', [new Param()]);
        }, 'params[name]に値が設定されていません。');
    });
    it('validationでparamsにtoが格納されていない場合、エラーが例外として出力されること', () => {
        assert.throw(() => {
            const db = new TestDB();
            const param = new Param();
            param.name = 'test';
            // tslint:disable-next-line
            new ChangeFieldsName(db, '', [param]);
        }, 'params[to]に値が設定されていません。');
    });
    describe('更新処理', () => {
        const param = new Param();
        param.name = 'name';
        param.to = 'name2';
        it('update関数にdocumentが渡されていること', async () => {
            const db = new TestDB();
            const c = new ChangeFieldsName(db, '', [param]);
            await c.Execute();
            assert.isNotEmpty(db.Docs);
        });
        it('name Fieldに削除フラグを立てる', async () => {
            const db = new TestDB();
            const c = new ChangeFieldsName(db, '', [param]);
            await c.Execute();
            assert.deepEqual(db.Docs[0].Datas.name, Operation.Delete);
        });
        it('param.toのField名でparam.nameの値が格納された状態でupdate関数が呼び出されていること', async () => {
            const db = new TestDB();
            const c = new ChangeFieldsName(db, '', [param]);
            await c.Execute();
            assert.deepEqual(db.Docs[0].Datas.name2, 'gaku');
        });
    });
});
