export default class {
    private collection: string;
    private params: Param[];
    constructor(collection: string, params: Param[]) {
        this.collection = collection;
        this.params = params;
    }
    get Collection(): string {
        return this.collection;
    }
    get Params(): Param[] {
        return this.params;
    }
}
