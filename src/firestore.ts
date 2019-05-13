import * as admin from 'firebase-admin';
export default class {
  constructor() {
    this.settingKey();
  }

  // fieldの追加処理
  public async add(collection: string, params: Param[]) {
    const data = await admin.firestore().collectionGroup(collection).get();
    data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot) => {
      await admin.firestore().doc(x.ref.path).update(this.convertFirestoreData(params));
    });
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

  // firestoreに格納できる形でdataを加工する
  private convertFirestoreData(params: Param[]): {[key: string]: string} {
    const list: {[key: string]: string} = {};
    params.forEach((x: Param) => {
      list[x.name] = x.value;
    });
    return list;
  }
}
