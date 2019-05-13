export default class {
    private date!: string;
    private path!: string;
    private content!: JsonRes;
    constructor(date: string, path: string, content: JsonRes) {
        this.date = date;
        this.path = path;
        this.content = content;
    }
    get Date(): string {
        return this.date;
    }
    set Date(date: string) {
        this.date = date;
    }
    get Path(): string {
        return this.path;
    }
    set Path(path: string) {
        this.path = path;
    }
    get Content(): JsonRes {
        return this.content;
    }
    set Content(content: JsonRes) {
        this.content = content;
    }
}
