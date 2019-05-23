import addFields from '@/usecase/AddFields';
import { assert } from 'chai';
import IRepository from '@/usecase/IRepository';
import { Document } from '@/domain/Document';

class Test implements IRepository {
    public list: {[key: string]: any} = {};
    async CollectionGroup2(collection: string): Promise<Document[]> {
        const documents: Document[] = [];
        const d = new Document();
        d.Path = 'collection path';
        documents.push(d);
        return documents;
    }
    Update2(documentPath: string, list: {[key: string]: any}) {
        this.list = list;
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
    it('更新処理が行われること', async () => {
        const a = new addFields(repo, 'test', [{name: 'name', if: '', value: 'value2', to: '', aggCollection: '', aggField: ''}]);
        await a.Execute();
        assert.deepEqual(repo.list['name'], 'value2');
    });
});
