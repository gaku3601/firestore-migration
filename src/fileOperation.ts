import * as fs from 'fs';
import * as path from 'path';
import migration from './migration';
export default class {
    private fileList: migration[] = [];
    constructor() {
      this.readFilePath();
      if (this.fileList === []) {
          return;
      }
    }
    // 処理を実施する
    public processing = () => {
        this.fileList.map((data: migration) => {
            console.log(data.Content.params);
        });
    }
    // ファイル読み込みを実施する
    private readFilePath = () => {
        const migrationDir = process.env.FS_DIR;
        if (!migrationDir) {
            console.log('環境変数FS_DIRを設定してください。');
            return;
        }
        // migrationフォルダからファイル一覧を取得
        fs.readdirSync(migrationDir).forEach((file: string) => {
          if (path.extname(file) !== '.json') {
              return;
          }
          const filePath = path.join(migrationDir, file);
          const jsonObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          this.fileList.push(new migration(file.slice(0, 17), filePath, jsonObject));
        });
        this.sort();
    }
    // ソートの実施
    private sort = () => {
        this.fileList.sort((a, b) => {
            if (a.Date > b.Date) {
                return 1;
            }
            if (a.Date < b.Date) {
                return -1;
            }
            return 0;
        });
    }
}
