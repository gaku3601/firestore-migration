import IRepository from '@/usecase/migrate/IRepository';
import ManagedVersion from '@/usecase/migrate/ManagedVersion';

export default abstract class Migration {
    constructor(protected db: IRepository, private version: string) {}

    // migration処理を実施します。
    public async StartMigration() {
        const managedVersion = new ManagedVersion(this.db, this.version);
        const flg = await managedVersion.CheckVersion();
        if (flg) {
            return;
        }
        this.Execute();
        managedVersion.AddVersion();
    }
    protected abstract Execute(): void;
}
