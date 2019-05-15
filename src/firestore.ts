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

  // documentを集計し値を格納する処理
  public async aggregateCollection(collection: string, params: Param[]) {
    const data = await admin.firestore().collectionGroup(collection).get();
    for (const v of params) {
      const aggData = await admin.firestore().collectionGroup(v.aggCollection).get();
      for (const d of data.docs) {
        const value: number = aggData.docs.filter((x: FirebaseFirestore.QueryDocumentSnapshot) => {
          // if部分の加工(文字列でコードの実装)
          const ifstr = v.if.replace(/\{(.*?)\}/g, (_, key) => {
            return `x.data().${key}`;
          }).replace(/\$ID/g, `d.id`);
          // tslint:disable-next-line
          return eval(ifstr);
        }).map((x: FirebaseFirestore.QueryDocumentSnapshot) => {
          // フィールドが存在しない場合,0を返却
          if (!x.data()[v.aggField]) {
            return 0;
          }
          return x.data()[v.aggField];
        }).reduce((pre: number, cur: number) => {
          return pre + cur;
        }, 0);

        // 書き込みデータの作成
        const list: {[key: string]: any} = {};
        list[v.name] = value;

        // 書き込み
        await admin.firestore().doc(d.ref.path).update(list);
      }
    }
  }

  // documentをカウントアップし値を格納する処理
  public async countupCollection(collection: string, params: Param[]) {
    const data = await admin.firestore().collectionGroup(collection).get();
    for (const v of params) {
      const aggData = await admin.firestore().collectionGroup(v.aggCollection).get();
      for (const d of data.docs) {
        const count = aggData.docs.filter((x: FirebaseFirestore.QueryDocumentSnapshot) => {
          // if部分の加工(文字列でコードの実装)
          const ifstr = v.if.replace(/\{(.*?)\}/g, (_, key) => {
            return `x.data().${key}`;
          }).replace(/\$ID/g, `d.id`);
          // tslint:disable-next-line
          return eval(ifstr)
        }).length;

        // 書き込みデータの作成
        const list: {[key: string]: any} = {};
        list[v.name] = count;

        // 書き込み
        await admin.firestore().doc(d.ref.path).update(list);
      }
    }
  }

  // collectionの削除を行います。
  public async deleteCollection(collection: string) {
    const batchSize: number = 500;
    const ref = admin.firestore().collectionGroup(collection);
    await this.deleteQueryBatch(ref, batchSize);
  }

  // migrationバージョンを適用済みかチェックし、未適用の場合、firestoreに保存を実施する
  public async checkMigrateVersion(version: string): Promise<boolean> {
    const data = await admin.firestore().collection('migrations').get();
    if (data.docs.length === 0) {
      await admin.firestore().collection('migrations').doc(version).set({});
      return false;
    }
    const flg = data.docs.some((x: FirebaseFirestore.QueryDocumentSnapshot): boolean => {
      return version === x.id;
    });
    if (!flg) {
      await admin.firestore().collection('migrations').doc(version).set({});
    }
    return flg;
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

  // コレクション削除処理
  private async deleteQueryBatch(query: FirebaseFirestore.Query, batchSize: number) {
    await query.limit(batchSize).get()
      .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0;
        }

        // Delete documents in a batch
        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
          return snapshot.size;
        });
      }).then((numDeleted) => {
        if (numDeleted === 0) {
          return;
        }
        process.nextTick(() => {
          this.deleteQueryBatch(query, batchSize);
        });
      });
  }
}
