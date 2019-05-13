import * as admin from 'firebase-admin';
export default class {
  constructor() {
    this.settingKey();
  }

  private settingKey() {
    const key = process.env.FS_KEY;
    if (!key) {
        console.log('環境変数FS_KEYを設定してください。');
        return;
    }
    const buffer = Buffer.from(key, 'base64');
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(buffer.toString()))
    });
  }

  public async add() {
    await admin.firestore().collection('test').add({
        aaa: 1
    });
  }
}