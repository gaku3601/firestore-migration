export class Document {
    private path: string;
    private datas: {[field: string]: any};

    constructor(path: string, datas: {[field: string]: any}) {
        this.path = path;
        this.datas = datas;
    }

    get Path(): string {
        return this.path;
    }

    get Datas(): {[field: string]: any} {
        return this.datas;
    }
}

export enum Operation {
  Delete = 'TransformDelete',
}
