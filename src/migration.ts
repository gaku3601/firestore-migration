import * as fs from 'fs';
import * as path from 'path';
export default () => {
    const fileList = readFiles();
    if (fileList === []) {
        return;
    }
};

// ファイル読み込みを実施する
const readFiles = (): Array<{date: string, path: string}> => {
    const migrationDir = process.env.FS_DIR;
    if (!migrationDir) {
        console.log('環境変数FS_DIRを設定してください。');
        return [];
    }
    const fileList: Array<{date: string, path: string}> = [];
    // migrationフォルダからファイル一覧を取得
    fs.readdirSync(migrationDir).forEach((file: string) => {
      if (path.extname(file) !== '.json') {
        return;
      }
      fileList.push({date: file.slice(0, 17), path: path.join(migrationDir, file)});
    });
    return sort(fileList);
};

// ソートの実施
const sort = (fileList: Array<{date: string, path: string}>): Array<{date: string, path: string}> => {
    fileList.sort((a, b) => {
        if (a.date > b.date) {
            return 1;
        }
        if (a.date < b.date) {
            return -1;
        }
        return 0;
    });
    return fileList;
};
