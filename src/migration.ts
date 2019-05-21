import repo from './db/firestore';
import firestore from './domain/firestore';
import MigrationFile from '@/domain/MigrationFile';
export default class {
    private version!: string;
    private path!: string;
    private content!: MigrationFile;
    constructor(version: string, path: string, content: any) {
        this.version = version;
        this.path = path;
        this.content = content as MigrationFile;
    }
    public async execute() {
        const db = new repo();
        const f = new firestore(db);
        const flg = await f.checkMigrateVersion(this.version);
        if (flg) {
            return;
        }
        if (this.content.method === 'ADD') {
            await f.add(this.content.collection, this.content.params);
        }
        if (this.content.method === 'DEL') {
            await f.del(this.content.collection, this.content.params);
        }
        if (this.content.method === 'MOD') {
            await f.mod(this.content.collection, this.content.params);
        }
        if (this.content.method === 'CHANGE_FIELD_NAME') {
            await f.changeFieldName(this.content.collection, this.content.params);
        }
        if (this.content.method === 'DELETE_COLLECTION') {
            await f.deleteCollection(this.content.collection);
        }
        if (this.content.method === 'AGG_COLLECTION') {
            await f.aggregateCollection(this.content.collection, this.content.params);
        }
        if (this.content.method === 'COUNTUP_COLLECTION') {
            await f.countupCollection(this.content.collection, this.content.params);
        }
        if (this.content.method === 'AGG_DOCUMENT') {
            await f.aggregateCollectionToDocument(this.content.document, this.content.params);
        }
        if (this.content.method === 'COUNTUP_DOCUMENT') {
            await f.countupCollectionToDocument(this.content.document, this.content.params);
        }
    }
    get Date(): string {
        return this.version;
    }
    get Path(): string {
        return this.path;
    }
    get Content(): MigrationFile {
        return this.content;
    }
}
