import * as commanders from 'commander';
import * as fs from 'fs';
import * as moment from 'moment';
import migration from './migration';
commanders
  .version('0.0.1', '-v, --version')
  .option('-t, --test', 'test option')
  .option('-c, --create <FileName>', 'create option')
  .option('-m, --migrate', 'migration!')
  .parse(process.argv);
const createFile = async () => {
  const tmp = await import('./templates/migration-file.tmp');

  const date: string = moment().format('YYYYMMDDHHmmssSSS');
  fs.writeFile(`${date}_${commanders.opts().create}.json`, tmp.default, (err) => {
    if (err) {
      console.log(err);
    }
    console.log('complete');
  });
};
if (commanders.create) {
  createFile();
}
if (commanders.migrate) {
  migration();
}
