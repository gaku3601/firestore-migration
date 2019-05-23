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
        this.db.CollectionGroup2(this.collection).then((docs: Document[]) => {
            for (const doc of docs) {
                this.db.Update2(doc.Path, this.params, 'ADD');
            }
        });
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
