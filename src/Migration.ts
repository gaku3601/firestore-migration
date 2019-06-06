import repo from '@/db/Firestore';
import MigrationFile from '@/domain/MigrationFile';
import AddFields from '@/usecase/migrate/AddFields';
import DeleteFields from '@/usecase/migrate/DeleteFields';
import ModFields from '@/usecase/migrate/ModFields';
import ChangeFieldsName from '@/usecase/migrate/ChangeFieldsName';
import ManagedVersion from '@/usecase/migrate/ManagedVersion';

export default class {
    private version!: string;
    private content!: MigrationFile;
    constructor(version: string, content: any) {
        this.version = version;
        this.content = content as MigrationFile;
    }
    public async execute() {
        const db = new repo();
        const managedVersion = new ManagedVersion(db, this.version);
        const flg = await managedVersion.CheckVersion();
        if (flg) {
            return;
        }
        if (this.content.method === 'ADD') {
            const addFields = new AddFields(db, this.content.collection, this.content.params);
            addFields.Execute();
            managedVersion.AddVersion();
        }
        if (this.content.method === 'DEL') {
            const deleteFields = new DeleteFields(db, this.content.collection, this.content.params);
            deleteFields.Execute();
            managedVersion.AddVersion();
        }
        if (this.content.method === 'MOD') {
            const modFields = new ModFields(db, this.content.collection, this.content.params);
            modFields.Execute();
            managedVersion.AddVersion();
        }
        if (this.content.method === 'CHANGE_FIELD_NAME') {
            const changeFieldsName = new ChangeFieldsName(db, this.content.collection, this.content.params);
            changeFieldsName.Execute();
            managedVersion.AddVersion();
        }
    }
    get Version(): string {
        return this.version;
    }
}
