import Param from '@/domain/Param';
import IRepository from './IRepository';
import { Document, Operation } from '@/domain/Document';
import Migration from '@/usecase/migrate/Migration';
export default class DeleteFields extends Migration {
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
                const storeDoc = this.createStoreDocument(doc.Path);
                this.db.Update(storeDoc);
            }
        });
    }
    private createStoreDocument(documentPath: string) {
        const datas: {[field: string]: any} = {};
        for (const param of this.params) {
            datas[param.name] = Operation.Delete;
        }
        return new Document(documentPath, datas);
    }
    private validation() {
        for (const param of this.params) {
            if (!param.name) {
                throw new Error('params[name]に値が設定されていません。');
            }
        }
    }
}
