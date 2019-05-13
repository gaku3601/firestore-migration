import * as commanders from 'commander';
import fileOperation from './fileOperation';
import createMigration from './createMigration';
commanders
  .version('0.0.1', '-v, --version')
  .option('-t, --test', 'test option')
  .option('-c, --create <FileName>', 'create option')
  .option('-m, --migrate <DirPath>', 'migration!')
  .parse(process.argv);
if (commanders.create) {
  const c = new createMigration();
  c.createFile(commanders.opts().create);
}
if (commanders.migrate) {
  const f = new fileOperation(commanders.opts().migrate);
  f.processing();
}
