import repo from '@/infrastructure/Firestore';
import MigrationFile from '@/domain/MigrationFile';
import MigrationController from '@/controller/MigrationController';

export default class {
    private version!: string;
    private content!: MigrationFile;
    constructor(version: string, content: MigrationFile) {
        this.version = version;
        this.content = content;
    }
    public async execute() {
        const db = new repo();
        const migrationController =
        new MigrationController(db, this.content.collection, this.content.params, this.version);
        if (this.content.method === 'ADD') {
            migrationController.Add();
        }
        if (this.content.method === 'DEL') {
            migrationController.Del();
        }
        if (this.content.method === 'MOD') {
            migrationController.Mod();
        }
        if (this.content.method === 'CHANGE_FIELD_NAME') {
            migrationController.ChangeFieldName();
        }
    }
    get Version(): string {
        return this.version;
    }
}
