export class Document {
    private path!: string;

    set Path(path: string) {
        this.path = path;
    }
    get Path(): string {
        return this.path;
    }
}
