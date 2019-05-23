import Param from '@/domain/Param';
import IRepository from './IRepository';
import { Document } from '@/domain/Document';
export default class {
    private collection: string;
    private afterConvertParams: {[key: string]: any} = {};
    private repo: IRepository;
    constructor(repo: IRepository, collection: string, params: Param[]) {
        this.repo = repo;
        this.collection = collection;
        this.validation(params);
        this.convertJsonParams(params);
    }
    public Execute() {
        this.repo.CollectionGroup2(this.collection).then((docs: Document[]) => {
            for (const doc of docs) {
                this.repo.Update2(doc.Path, this.afterConvertParams);
            }
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
    // firestoreに格納できる形へJsonから取得したパラメータを変形する
    private convertJsonParams(params: Param[]) {
        for (const param of params) {
            this.afterConvertParams[param.name] = param.value;
        }
    }
}
