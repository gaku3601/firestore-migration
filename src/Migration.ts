import repo from './db/Firestore';
import firestore from './domain/Firestore';
import MigrationFile from '@/domain/MigrationFile';
import AddFields from '@/usecase/AddFields';
import DeleteFields from '@/usecase/DeleteFields';
import ModFields from './usecase/ModFields';
import ChangeFieldsName from '@/usecase/ChangeFieldsName';

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
        /*
        const flg = await f.checkMigrateVersion(this.version);
        if (flg) {
            return;
        }
        */
        if (this.content.method === 'ADD') {
            const addFields = new AddFields(db, this.content.collection, this.content.params);
            addFields.Execute();
        }
        if (this.content.method === 'DEL') {
            const deleteFields = new DeleteFields(db, this.content.collection, this.content.params);
            deleteFields.Execute();
        }
        if (this.content.method === 'MOD') {
            const modFields = new ModFields(db, this.content.collection, this.content.params);
            modFields.Execute();
        }
        if (this.content.method === 'CHANGE_FIELD_NAME') {
            const changeFieldsName = new ChangeFieldsName(db, this.content.collection, this.content.params);
            changeFieldsName.Execute();
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
