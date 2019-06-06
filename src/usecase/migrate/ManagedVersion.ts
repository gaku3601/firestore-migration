import IRepository from '@/usecase/migrate/IRepository';
import { Document } from '@/domain/Document';

export default class {
    private collection: string = 'migrations';
    constructor(private db: IRepository, private version: string) {}

    public async CheckVersion(): Promise<boolean> {
        const docs = await this.db.CollectionGroup('migrations');
        for (const doc of docs) {
            if (doc.Path === `${this.collection}/${this.version}`) {
                console.log(`${this.version}は適用済みのため処理を実施しません。`);
                return true;
            }
        }
        return false;
    }

    public AddVersion() {
        const doc = new Document(`${this.collection}/${this.version}`, {});
        this.db.Set(doc);
    }
}
