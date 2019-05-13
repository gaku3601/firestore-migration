import * as fs from 'fs';
import * as path from 'path';
import migration from './migration';
export default class {
    private fileList: migration[] = [];
    private dirPath: string;
    constructor(dirPath: string) {
      this.dirPath = path.join(process.cwd(), dirPath);
      this.readFilePath();
      if (this.fileList === []) {
          return;
      }
    }
    // 処理を実施する
    public processing = () => {
        this.fileList.forEach((v: migration) => {
            v.execute();
        });
    }
    // ファイル読み込みを実施する
    private readFilePath = () => {
        // フォルダからファイル一覧を取得
        fs.readdirSync(this.dirPath).forEach((file: string) => {
          if (path.extname(file) !== '.json') {
              return;
          }
          const filePath = path.join(this.dirPath, file);
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
