import { assert } from 'chai';
import ModFields from '@/usecase/migrate/ModFields';
import Param from '@/domain/Param';
import IRepository from '@/usecase/migrate/IRepository';
import { Document } from '@/domain/Document';

class TestDB implements IRepository {
    public Docs: Document[] = [];
    public async CollectionGroup(collection: string): Promise<Document[]> {
        const docs: Document[] = [];
        docs.push(new Document('path1', {name: 'gaku', age: 27, sex: 0}));
        docs.push(new Document('path2', {name: 'gakuko', age: 20, sex: 1}));
        docs.push(new Document('path3', {name: 'gakuzo', age: 30, sex: 0}));
        return docs;
    }
    public Update(doc: Document): void {
        this.Docs.push(doc);
    }
    // tslint:disable-next-line
    public Set(doc: Document): void {
    }
}

describe('ModFields class', () => {
    it ('インスタンス生成時、paramsにnameが格納されていない場合、例外が出力されること', () => {
        assert.throw(() => {
            const p = new Param();
            p.value = 'value';
            p.if = 'if';
            const db = new TestDB();
            // tslint:disable-next-line
            new ModFields(db, 'collection', [p], '');
        }, 'params[name]に値が設定されていません。');
    });
    it ('インスタンス生成時、paramsにvalueが格納されていない場合、例外が出力されること', () => {
        assert.throw(() => {
            const p = new Param();
            p.name = 'name';
            p.if = 'if';
            const db = new TestDB();
            // tslint:disable-next-line
            new ModFields(db, 'collection', [p], '');
        }, 'params[value]に値が設定されていません。');
    });
    it ('インスタンス生成時、paramsにifが格納されていない場合、例外が出力されること', () => {
        assert.throw(() => {
            const p = new Param();
            p.name = 'name';
            p.value = 'value';
            const db = new TestDB();
            // tslint:disable-next-line
            new ModFields(db, 'collection', [p], '');
        }, 'params[if]に値が設定されていません。');
    });
    describe ('更新処理を実施する', () => {
        describe ('if paramの評価', async () => {
            const p = new Param();
            p.name = 'sex';
            p.value = '男';
            p.if = '{sex} === 0';
            const db = new TestDB();
            const m = new ModFields(db, '', [p], '');
            await m.StartMigration();
            it ('テストデータ[path1]でsex:0のデータがsex:男に変換されたデータが渡っていること', () => {
                assert.deepEqual(db.Docs[0].Datas, {sex: '男'});
            });
            it ('変換対象であるsex:0のデータ2件のみが更新処理にわたっていること', () => {
                assert.deepEqual(db.Docs.length, 2);
            });
        });
    });
});
