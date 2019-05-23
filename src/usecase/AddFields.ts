import Param from '@/domain/Param';
export default class {
    private collection: string;
    private params: Param[];
    constructor(collection: string, params: Param[]) {
        this.collection = collection;
        this.params = params;
        this.validation(params);
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
    get Collection(): string {
        return this.collection;
    }
    get Params(): Param[] {
        return this.params;
    }
}
