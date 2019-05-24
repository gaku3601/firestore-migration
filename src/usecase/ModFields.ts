import Param from '@/domain/Param';
import IRepository from '@/usecase/IRepository';
import { Document } from '@/domain/Document';
export default class {
    private db: IRepository;
    private collection: string;
    private params: Param[];
    constructor(db: IRepository, collection: string, params: Param[]) {
        this.db = db;
        this.collection = collection;
        this.params = params;
        this.validation(params);
    }
    public Execute() {
        this.db.CollectionGroup2(this.collection).then((docs: Document[]) => {
            docs.forEach((doc: Document) => {
                const storeData = this.createStoreData(doc.Path, doc.Datas);
                if (Object.keys(storeData.Datas).length !== 0) {
                    this.db.Update2(storeData);
                }
            });
        });
    }
    private createStoreData(documentPath: string, datas: {[field: string]: any}) {
        const storeDatas: {[field: string]: any} = {};
        for (const param of this.params) {
            const str = param.if.replace(/\{(.*?)\}/g, (_, key) => {
              if (typeof datas[key] === 'string') {
                return `'${datas[key]}'`;
              }
              return datas[key];
            });
            // tslint:disable-next-line
            if (!eval(str) as boolean) {
                continue;
            }
            storeDatas[param.name] = param.value;
        }
        return new Document(documentPath, storeDatas);
    }
    private validation(params: Param[]) {
        for (const param of params) {
            if (!param.name) {
                throw new Error('params[name]に値が設定されていません。');
            }
            if (!param.value) {
                throw new Error('params[value]に値が設定されていません。');
            }
            if (!param.if) {
                throw new Error('params[if]に値が設定されていません。');
            }
        }
    }
}
