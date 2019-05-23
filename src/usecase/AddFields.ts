import Param from '@/domain/Param';
import IRepository from './IRepository';
export default class {
    private collection: string;
    private params: Param[];
    private afterConvertParams: {[key: string]: any} = {};
    private repo: IRepository
    constructor(repo: IRepository, collection: string, params: Param[]) {
        this.repo = repo;
        this.collection = collection;
        this.params = params;
        this.validation();
        this.convertJsonParams();
    }
    public Execute() {
        this.repo.CollectionGroup2(this.collection).then(docs => {
            for (const doc of docs) {
                this.repo.Update2(doc.Path, this.afterConvertParams);
            }
        });
    }
    private convertJsonParams() {
        for (const param of this.params) {
            this.afterConvertParams[param.name] = param.value;
        }
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
