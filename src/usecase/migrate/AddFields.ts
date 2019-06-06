import Param from '@/domain/Param';
import IRepository from './IRepository';
import { Document } from '@/domain/Document';
export default class {
    private collection: string;
    private params: Param[];
    private db: IRepository;
    constructor(db: IRepository, collection: string, params: Param[]) {
        this.db = db;
        this.collection = collection;
        this.params = params;
        this.validation();
    }
    public Execute() {
        this.db.CollectionGroup(this.collection).then((docs: Document[]) => {
            for (const doc of docs) {
                const storeDocument = this.createStoreDocument(doc.Path);
                this.db.Update(storeDocument);
            }
        });
    }
    private createStoreDocument(documentPath: string): Document {
        const datas: {[field: string]: any} = {};
        for (const param of this.params) {
            datas[param.name] = param.value;
        }
        return new Document(documentPath, datas);
    }
    private validation() {
        for (const param of this.params) {
            if (!param.name) {
                throw new Error('params[name]に値が設定されていません。');
            }
            if (!param.value) {
                throw new Error('params[value]に値が設定されていません。');
            }
        }
    }
}
