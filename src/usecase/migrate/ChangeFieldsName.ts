import Param from '@/domain/Param';
import IRepository from '@/usecase/migrate/IRepository';
import { Document, Operation } from '@/domain/Document';
import Migration from '@/usecase/migrate/Migration';
export default class ChangeFieldsName extends Migration {
    private collection: string;
    private params: Param[];
    constructor(db: IRepository, collection: string, params: Param[], version: string) {
        super(db, version);
        this.collection = collection;
        this.params = params;
        this.validation();
    }
    protected Execute() {
        this.db.CollectionGroup(this.collection).then((docs: Document[]) => {
            for (const doc of docs) {
                const storeDoc = this.createStoreDocument(doc.Path, doc);
                this.db.Update(storeDoc);
            }
        });
    }
    private createStoreDocument(documentPath: string, doc: Document): Document {
        const datas: {[field: string]: any} = {};
        for (const param of this.params) {
            datas[param.name] = Operation.Delete;
            datas[param.to] = doc.Datas[param.name];
        }
        return new Document(documentPath, datas);
    }
    private validation() {
        for (const param of this.params) {
            if (!param.name) {
                throw new Error('params[name]に値が設定されていません。');
            }
            if (!param.to) {
                throw new Error('params[to]に値が設定されていません。');
            }
        }
    }
}
