import AddFields from '@/usecase/migrate/AddFields';
import DeleteFields from '@/usecase/migrate/DeleteFields';
import ModFields from '@/usecase/migrate/ModFields';
import ChangeFieldsName from '@/usecase/migrate/ChangeFieldsName';
import IRepository from '@/usecase/migrate/IRepository';
import Param from '@/domain/Param';

export default class {
    constructor(private db: IRepository, private collection: string, private params: Param[], private version: string) {}
    public Add() {
        const addFields = new AddFields(this.db, this.collection, this.params, this.version);
        addFields.StartMigration();
    }
    public Del() {
        const deleteFields = new DeleteFields(this.db, this.collection, this.params, this.version);
        deleteFields.StartMigration();
    }
    public Mod() {
        const modFields = new ModFields(this.db, this.collection, this.params, this.version);
        modFields.StartMigration();
    }
    public ChangeFieldName() {
        const changeFieldsName = new ChangeFieldsName(this.db, this.collection, this.params, this.version);
        changeFieldsName.StartMigration();
    }
}
