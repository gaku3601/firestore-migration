import * as commanders from 'commander';
import fileOperation from './fileOperation';
commanders
  .version('0.0.1', '-v, --version')
  .option('-t, --test', 'test option')
  .option('-c, --create <FileName>', 'create option')
  .option('-m, --migrate <DirPath>', 'migration!')
  .parse(process.argv);
if (commanders.create) {
  const c = new fileOperation();
  c.createFile(commanders.opts().create);
}
if (commanders.migrate) {
  const f = new fileOperation();
  f.migrate(commanders.opts().migrate);
}
