import * as admin from 'firebase-admin';
import IRepository from '@/domain/IRepository';
import { Document, Operation } from '@/domain/Document';
export default class Firestore implements IRepository {
    constructor() {
        this.settingKey();
    }

    public DeleteField(): FirebaseFirestore.FieldValue {
        return admin.firestore.FieldValue.delete();
    }
    public Collection(collection: string): Promise<FirebaseFirestore.QuerySnapshot> {
        return admin.firestore().collection(collection).get();
    }
    public CollectionGroupQuery(collection: string): FirebaseFirestore.Query {
        return admin.firestore().collectionGroup(collection);
    }
    public Update(documentPath: string, list: { [key: string]: any; }): Promise<FirebaseFirestore.WriteResult> {
        return admin.firestore().doc(documentPath).update(list);
    }
    public Update2(doc: Document) {
        const list = this.convertDocument(doc.Datas);
        admin.firestore().doc(doc.Path).update(list);
    }
    public Set2(doc: Document) {
        const list = this.convertDocument(doc.Datas);
        admin.firestore().doc(doc.Path).set(list);
    }
    public Set(documentPath: string, list: { [key: string]: any; }): Promise<FirebaseFirestore.WriteResult> {
        return admin.firestore().doc(documentPath).set(list);
    }
    public Batch(): FirebaseFirestore.WriteBatch {
        return admin.firestore().batch();
    }
    public async CollectionGroup(collection: string) {
        return admin.firestore().collectionGroup(collection).get();
    }
    public async CollectionGroup2(collection: string): Promise<Document[]> {
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
