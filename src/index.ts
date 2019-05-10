import * as commanders from 'commander';
import * as fs from 'fs';
commanders
  .version('0.0.1', '-v, --version')
  .option('-t, --test', 'test option')
  .option('-c, --create', 'create option')
  .parse(process.argv);
const createFile = async () => {
  const tmp = await import('./templates/migration-file.tmp');
  const str: string = tmp.default.replace(/\\n/g, '\n');
  fs.writeFile('テストoutput2.txt', str, (err) => {
    if (err) {
      console.log(err);
    }
    console.log('complete');
  });
};
if (commanders.test) {
  console.log('add test option');
}
if (commanders.create) {
  createFile();
}
