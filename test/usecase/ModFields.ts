import { assert } from 'chai';
import ModFields from '@/usecase/ModFields';
import Param from '@/domain/Param';
import IRepository from '@/usecase/IRepository';
import { Document } from '@/domain/Document';

class TestDB implements IRepository {
    public callUpdateFlg = false;
    public Counter = 0;
    public async CollectionGroup2(collection: string): Promise<Document[]> {
        const docs: Document[] = [];
        docs.push(new Document('path1', {name: 'gaku', age: 27, sex: 0}));
        docs.push(new Document('path2', {name: 'gakuko', age: 20, sex: 1}));
        docs.push(new Document('path3', {name: 'gakuzo', age: 30, sex: 0}));
        return docs;
    }
    public Update2(doc: Document): void {
        this.Counter++;
        this.callUpdateFlg = true;
    }
}

describe('ModFields class', () => {
    it ('インスタンス生成時、paramsにnameが格納されていない場合、例外が出力されること', () => {
        assert.throw(() => {
            const p = new Param();
            p.value = 'value';
            const db = new TestDB();
            // tslint:disable-next-line
            new ModFields(db, 'collection', [p]);
        }, 'params[name]に値が設定されていません。');
    });
    it ('インスタンス生成時、paramsにvalueが格納されていない場合、例外が出力されること', () => {
        assert.throw(() => {
            const p = new Param();
            p.name = 'name';
            const db = new TestDB();
            // tslint:disable-next-line
            new ModFields(db, 'collection', [p]);
        }, 'params[value]に値が設定されていません。');
    });
    /*
    describe ('更新処理を実施する', () => {
        it ('取得したドキュメントの数だけ、更新処理が行われること', async () => {
            const p = new Param();
            p.name = 'name';
            p.value = 'value';
            const db = new TestDB();
            const m = new ModFields(db, 'collection', [p]);
            await m.Execute();
            assert.deepEqual(db.Counter, 3);
        })
        describe ('if paramの評価', async () => {
            const p = new Param();
            p.name = 'sex';
            p.value = '男';
            p.if = '{sex} === 0';
           const db = new TestDB();
           const m = new ModFields(db, '', [p]);
           await m.Execute()
            it ('テストデータでsex:0のデータがsex:男に変換されること', () => {
                assert.deepEqual(db.Params[0].value, '男');
            })
            it ('テストデータでsex:1のデータは変換されず1のままであること', () => {
                assert.deepEqual(db.Params[1].value, 1);
            })
        })
    })
    */
});
