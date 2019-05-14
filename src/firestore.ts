import * as admin from 'firebase-admin';
export default class {
  constructor() {
    this.settingKey();
  }

  // fieldの追加処理
  public async add(collection: string, params: Param[]) {
    const data = await admin.firestore().collectionGroup(collection).get();
    data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot) => {
      await admin.firestore().doc(x.ref.path).update(this.convertAddDataToFirestore(params));
    });
  }

  // fieldの削除処理
  public async del(collection: string, params: Param[]) {
    const data = await admin.firestore().collectionGroup(collection).get();
    data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot) => {
      await admin.firestore().doc(x.ref.path).update(this.convertDelDataToFirestore(params));
    });
  }

  // fieldの修正処理
  public async mod(collection: string, params: Param[]) {
    const data = await admin.firestore().collectionGroup(collection).get();
    data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot) => {
      const list = this.convertModDataToFirestore(x.data(), params);
      if (Object.keys(list).length !== 0) {
        await admin.firestore().doc(x.ref.path).update(list);
      }
    });
  }
  // field名の変更処理
  public async changeFieldName(collection: string, params: Param[]) {
    const data = await admin.firestore().collectionGroup(collection).get();
    data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot): Promise<void> => {
      const list = this.convertChangeFieldNameDataToFirestore(x.data(), params);
      if (Object.keys(list).length !== 0) {
        await admin.firestore().doc(x.ref.path).update(list);
      }
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

  // firestoreに格納できる形でadddataを加工する
  private convertAddDataToFirestore(params: Param[]): {[key: string]: string} {
    const list: {[key: string]: string} = {};
    params.forEach((x: Param) => {
      list[x.name] = x.value;
    });
    return list;
  }

  // firestoreに格納できる形でdelldataを加工する
  private convertDelDataToFirestore(params: Param[]): {[key: string]: FirebaseFirestore.FieldValue} {
    const list: {[key: string]: FirebaseFirestore.FieldValue} = {};
    params.forEach((x: Param) => {
      list[x.name] = admin.firestore.FieldValue.delete();
    });
    return list;
  }

  // firestoreに格納できる形でdelldataを加工する
  private convertModDataToFirestore(data: FirebaseFirestore.DocumentData, params: Param[]): {[key: string]: any} {
    const list: {[key: string]: any} = {};
    params.forEach((x: Param) => {
      if (Boolean(x.if) && this.checkIfExp(data, x.if)) {
        list[x.name] = x.value;
      } else if (!Boolean(x.if)) {
        list[x.name] = x.value;
      }
    });
    return list;
  }

  // firestoreに格納できる形でdelldataを加工する
  private convertChangeFieldNameDataToFirestore(data: FirebaseFirestore.DocumentData, params: Param[])
  : {[key: string]: any} {
    const list: {[key: string]: any} = {};
    params.forEach((x: Param) => {
      if (Boolean(data[x.name])) {
        list[x.name] = admin.firestore.FieldValue.delete();
        list[x.to] = data[x.name];
      }
    });
    return list;
  }

  // paramのifを評価する
  private checkIfExp(data: FirebaseFirestore.DocumentData, ifstr: string): boolean {
    const str = ifstr.replace(/\{(.*?)\}/g, (_, key) => {
      if (typeof data[key] === 'string') {
        return `'${data[key]}'`;
      }
      return data[key];
    });
    // tslint:disable-next-line
    return eval(str) as boolean;
  }
}
