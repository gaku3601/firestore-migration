import FileOperation from '@/usecase/FileOperation';
import MigrationFileList from '@/domain/MigrationFileList';
import AddFields from '@/usecase/migrate/AddFields';
import DeleteFields from '@/usecase/migrate/DeleteFields';
import ModFields from '@/usecase/migrate/ModFields';
import ChangeFieldsName from '@/usecase/migrate/ChangeFieldsName';
import repo from '@/infrastructure/Firestore';
import * as path from 'path';
export default class Index {
    // 処理を実施する
    public migrate = (dirPath: string) => {
        dirPath = path.join(process.cwd(), dirPath);
        const f = new FileOperation();
        const fileList = f.readFilePath(dirPath);
        if (fileList === []) {
            return;
        }
        fileList.forEach((v: MigrationFileList) => {
            const db = new repo();
            if (v.content.method === 'ADD') {
                const addFields = new AddFields(db, v.content.collection, v.content.params, v.version);
                addFields.StartMigration();
            }
            if (v.content.method === 'DEL') {
                const deleteFields = new DeleteFields(db, v.content.collection, v.content.params, v.version);
                deleteFields.StartMigration();
            }
            if (v.content.method === 'MOD') {
                const modFields = new ModFields(db, v.content.collection, v.content.params, v.version);
                modFields.StartMigration();
            }
            if (v.content.method === 'CHANGE_FIELD_NAME') {
                const changeFieldsName = new ChangeFieldsName(db, v.content.collection, v.content.params, v.version);
                changeFieldsName.StartMigration();
            }
        });
    }
}
