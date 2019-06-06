import { assert } from 'chai';
import Migration from '@/usecase/migrate/ManagedVersion';
import IRepository from '@/usecase/migrate/IRepository';
import { Document } from '@/domain/Document';

class Test implements IRepository {
    public Doc!: Document;
    public async CollectionGroup2(collection: string): Promise<Document[]> {
        const docs: Document[] = [];
        docs.push(new Document('migrations/20190514162121556', {}));
        docs.push(new Document('migrations/20190514162121557', {}));
        docs.push(new Document('migrations/20190514162121558', {}));
        return docs;
    }
    public Update2(doc: Document): void {
        this.Doc = doc;
    }
    public Set2(doc: Document): void {
        this.Doc = doc;
    }
}

describe('Migration class', () => {
    describe('versionが存在しているかcheckする', () => {
        it('存在している場合、trueを返却', async () => {
            const repo = new Test();
            const version = '20190514162121557' ;
            const m = new Migration(repo, version);
            assert.isTrue(await m.CheckVersion());
        });
        it('存在していない場合、falseを返却', async () => {
            const repo = new Test();
            const version = '20190514162121559' ;
            const m = new Migration(repo, version);
            assert.isNotTrue(await m.CheckVersion());
        });
    });
    describe('versionを格納する', () => {
        it('set関数にpath:migrations/{version}なdocumentが渡されるか', () => {
            const repo = new Test();
            const version = '20190514162121559';
            const m = new Migration(repo, version);
            m.AddVersion();
            assert.deepEqual(repo.Doc.Path, 'migrations/20190514162121559');
        });
    });
});
