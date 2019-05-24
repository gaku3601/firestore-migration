import Param from '@/domain/Param';
import IRepository from '@/usecase/IRepository';
import { Document } from '@/domain/Document';
export default class {
    private db: IRepository;
    private collection: string;
    constructor(db: IRepository, collection: string, params: Param[]) {
        this.db = db;
        this.collection = collection;
        this.validation(params);
    }
    public Execute() {
        this.db.CollectionGroup2(this.collection).then((docs: Document[]) => {
            docs.forEach((doc: Document) => {
                this.db.Update2(doc);
            });
        });
    }
    private validation(params: Param[]) {
        for (const param of params) {
            if (!param.name) {
                throw new Error('params[name]に値が設定されていません。');
            }
            if (!param.value) {
                throw new Error('params[value]に値が設定されていません。');
            }
        }
    }
}
