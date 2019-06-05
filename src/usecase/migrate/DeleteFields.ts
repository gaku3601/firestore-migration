import Param from '@/domain/Param';
import IRepository from './IRepository';
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
        this.db.CollectionGroup2(this.collection).then((docs: Document[]) => {
            for (const doc of docs) {
                const storeDoc = this.createStoreDocument(doc.Path);
                this.db.Update2(storeDoc);
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
