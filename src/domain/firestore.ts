import IRepository from '@/domain/iRepository';
import { Document } from '@/domain/document';
export default class {
    private db!: IRepository;
    constructor(fireStoreHandler: IRepository) {
      this.db = fireStoreHandler;
    }

    // fieldの追加処理
    public add(collection: string, params: Param[]) {
      this.db.CollectionGroup2(collection).then((docs: Document[]) => {
        docs.forEach((x: Document) => {
          this.db.Update2(x.Path, this.convertAddDataToFirestore(params));
        });
      });
    }

    // fieldの削除処理
    public async del(collection: string, params: Param[]) {
      const data = await this.db.CollectionGroup(collection);
      data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot) => {
        await this.db.Update(x.ref.path, this.convertDelDataToFirestore(params));
      });
    }

    // fieldの修正処理
    public async mod(collection: string, params: Param[]) {
      const data = await this.db.CollectionGroup(collection);
      data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot) => {
        const list = this.convertModDataToFirestore(x.data(), params);
        if (Object.keys(list).length !== 0) {
          await this.db.Update(x.ref.path, list);
        }
      });
    }
    // field名の変更処理
    public async changeFieldName(collection: string, params: Param[]) {
      const data = await this.db.CollectionGroup(collection);
      data.docs.map(async (x: FirebaseFirestore.QueryDocumentSnapshot): Promise<void> => {
        const list = this.convertChangeFieldNameDataToFirestore(x.data(), params);
        if (Object.keys(list).length !== 0) {
          await this.db.Update(x.ref.path, list);
        }
      });
    }

    // documentを集計し値を格納する処理
    public async aggregateCollection(collection: string, params: Param[]) {
      const data = await this.db.CollectionGroup(collection);
      for (const v of params) {
        const aggData = await this.db.CollectionGroup(v.aggCollection);
        for (const d of data.docs) {
          // 書き込みデータの作成
          const list: {[key: string]: any} = {};
          list[v.name] = this.aggregateValue(aggData, v, d);

          // 書き込み
          await this.db.Update(d.ref.path, list);
        }
      }
    }

    // documentを集計し値を格納する処理(単一documentに格納)
    public async aggregateCollectionToDocument(document: string, params: Param[]) {
      for (const v of params) {
        const aggData = await this.db.CollectionGroup(v.aggCollection);

        // 書き込みデータの作成
        const list: {[key: string]: any} = {};
        list[v.name] = this.aggregateValue(aggData, v, null);

        // 書き込み
        await this.db.Update(document, list);
      }
    }

    // documentをカウントアップし値を格納する処理
    public async countupCollection(collection: string, params: Param[]) {
      const data = await this.db.CollectionGroup(collection);
      for (const v of params) {
        const aggData = await this.db.CollectionGroup(v.aggCollection);
        for (const d of data.docs) {
          // 書き込みデータの作成
          const list: {[key: string]: any} = {};
          list[v.name] = this.countupValue(aggData, v, d);

          // 書き込み
          await this.db.Update(d.ref.path, list);
        }
      }
    }

    // documentをカウントアップし値を格納する処理(単一documentに格納)
    public async countupCollectionToDocument(document: string, params: Param[]) {
      for (const v of params) {
        const aggData = await this.db.CollectionGroup(v.aggCollection);
          // 書き込みデータの作成
        const list: {[key: string]: any} = {};
        list[v.name] = this.countupValue(aggData, v, null);

        // 書き込み
        await this.db.Update(document, list);
      }
    }

    // collectionの削除を行います。
    public async deleteCollection(collection: string) {
      const batchSize: number = 500;
      const ref = this.db.CollectionGroupQuery(collection);
      await this.deleteQueryBatch(ref, batchSize);
    }

    // migrationバージョンを適用済みかチェックし、未適用の場合、firestoreに保存を実施する
    public async checkMigrateVersion(version: string): Promise<boolean> {
      const data = await this.db.Collection('migrations');
      if (data.docs.length === 0) {
        await this.db.Set(`migrations/${version}`, {});
        return false;
      }
      const flg = data.docs.some((x: FirebaseFirestore.QueryDocumentSnapshot): boolean => {
        return version === x.id;
      });
      if (!flg) {
        await this.db.Set(`migrations/${version}`, {});
      }
      return flg;
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
        list[x.name] = this.db.DeleteField();
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
          list[x.name] = this.db.DeleteField();
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
          const batch = this.db.Batch();
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

    // 集計処理を実施する
    private aggregateValue(
      aggCollection: FirebaseFirestore.QuerySnapshot,
      param: Param,
      doc: FirebaseFirestore.QueryDocumentSnapshot | null): number {
      return aggCollection.docs.filter((x: FirebaseFirestore.QueryDocumentSnapshot) => {
        if (param.if) {
          // if部分の加工(文字列でコードの実装)
          const ifstr = param.if.replace(/\{(.*?)\}/g, (_, key) => {
            return `x.data().${key}`;
          }).replace(/\$ID/g, `doc.id`);
          // tslint:disable-next-line
          return eval(ifstr);
        } else {
          return true;
        }
      }).map((x: FirebaseFirestore.QueryDocumentSnapshot) => {
        // フィールドが存在しない場合,0を返却
        if (!x.data()[param.aggField]) {
          return 0;
        }
        return x.data()[param.aggField];
      }).reduce((pre: number, cur: number) => {
        return pre + cur;
      }, 0);
    }

    // document数を集計し返却する
    private countupValue(
      aggCollection: FirebaseFirestore.QuerySnapshot,
      param: Param, doc: FirebaseFirestore.QueryDocumentSnapshot | null): number {
      return aggCollection.docs.filter((x: FirebaseFirestore.QueryDocumentSnapshot) => {
        // if部分の加工(文字列でコードの実装)
        const ifstr = param.if.replace(/\{(.*?)\}/g, (_, key) => {
          return `x.data().${key}`;
        }).replace(/\$ID/g, `doc.id`);
        // tslint:disable-next-line
        return eval(ifstr)
      }).length;
    }
}
