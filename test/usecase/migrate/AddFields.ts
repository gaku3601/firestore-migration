import addFields from '@/usecase/migrate/AddFields';
import { assert } from 'chai';
import IRepository from '@/usecase/migrate/IRepository';
import { Document } from '@/domain/Document';
import Param from '@/domain/Param';
import AddFields from '@/usecase/migrate/AddFields';

class Test implements IRepository {
    public Doc!: Document;
    public async CollectionGroup(collection: string): Promise<Document[]> {
        const docs: Document[] = [];
        docs.push(new Document('path1', {name: 'gaku', age: 27, sex: 0}));
        docs.push(new Document('path2', {name: 'gakuko', age: 20, sex: 1}));
        docs.push(new Document('path3', {name: 'gakuzo', age: 30, sex: 0}));
        return docs;
    }
    public Update(doc: Document): void {
        this.Doc = doc;
    }
    public Set(doc: Document): void {
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
    describe('更新処理', () => {
        const param = new Param();
        param.name = 'location';
        param.value = 'nara';
        const db = new Test();
        const add = new AddFields(db, '', [param]);
        add.Execute();
        it('location: naraなdocumentが更新関数に渡されること', () => {
            assert.deepEqual(db.Doc.Datas, {location: 'nara'});
        });
    });
});
