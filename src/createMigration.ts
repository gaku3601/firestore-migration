import * as fs from 'fs';
import * as moment from 'moment';
export default class {
  public createFile = async (fileName: string) => {
    const tmp = await import('./templates/migration-file.tmp');
    const date: string = moment().format('YYYYMMDDHHmmssSSS');
    fs.writeFile(`${date}_${fileName}.json`, tmp.default, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('complete');
    });
  }
}
