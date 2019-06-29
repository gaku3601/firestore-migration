import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import MigrationFileList from '@/domain/MigrationFileList';
export default class {
    // migration fileを作成します。
    public createFile = async (fileName: string) => {
      const tmp = await import('@/templates/migration-file.tmp');
      const date: string = moment().format('YYYYMMDDHHmmssSSS');
      fs.writeFile(`${date}_${fileName}.json`, tmp.default, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('complete');
      });
    }
    // ファイル読み込みを実施する
    public readFilePath = (dirPath: string): MigrationFileList[] => {
      let fileList: MigrationFileList[] = [];
      // フォルダからファイル一覧を取得
      fs.readdirSync(dirPath).forEach((file: string) => {
        if (path.extname(file) !== '.json') {
            return;
        }
        const filePath = path.join(dirPath, file);
        const jsonObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        fileList.push(new MigrationFileList(file.slice(0, 17), jsonObject));
      });
      fileList = this.sort(fileList);
      return fileList;
    }
    // ソートの実施
    private sort = (fileList: MigrationFileList[]): MigrationFileList[] => {
        fileList.sort((a, b) => {
            if (a.version > b.version) {
                return 1;
            }
            if (a.version < b.version) {
                return -1;
            }
            return 0;
        });
        return fileList;
    }
}
