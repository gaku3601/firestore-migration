import Param from '@/domain/Param';
import IRepository from '@/usecase/migrate/IRepository';
import { Document, Operation } from '@/domain/Document';
export default class {
    private db: IRepository;
    private collection: string;
    private params: Param[];
    constructor(db: IRepository, collection: string, params: Param[]) {
        this.db = db;
        this.collection = collection;
        this.params = params;
        this.validation();
    }
    public Execute() {
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
