import * as admin from 'firebase-admin';
import IRepository from '@/usecase/migrate/IRepository';
import { Document, Operation } from '@/domain/Document';
export default class Firestore implements IRepository {
    constructor() {
        this.settingKey();
    }

    public Update(doc: Document) {
        const list = this.convertDocument(doc.Datas);
        admin.firestore().doc(doc.Path).update(list);
    }
    public Set(doc: Document) {
        const list = this.convertDocument(doc.Datas);
        admin.firestore().doc(doc.Path).set(list);
    }
    public async CollectionGroup(collection: string): Promise<Document[]> {
        const documents: Document[] = [];
        const data = await admin.firestore().collectionGroup(collection).get();
        data.forEach((x: FirebaseFirestore.QueryDocumentSnapshot) => {
            const doc = new Document(x.ref.path, x.data());
            documents.push(doc);
        });
        return documents;
    }

    private settingKey() {
        const key = process.env.FS_KEY;
        if (!key) {
            console.log('環境変数FS_KEYを設定してください。');
            return;
        }
        const buffer = Buffer.from(key, 'base64');
        if (!admin.apps.length) { // 一度だけ設定
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(buffer.toString())),
            });
        }
    }

    private convertDocument(datas: {[field: string]: any}) {
        for (const key in datas) {
            if (datas[key] === Operation.Delete) {
                datas[key] = admin.firestore.FieldValue.delete();
            }
        }
        return datas;
    }
}
