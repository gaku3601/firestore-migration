import * as commanders from 'commander';
commanders
  .version('0.0.1', '-v, --version')
  .option('-t, --test', 'test option')
  .parse(process.argv);
if (commanders.test) {
  console.log('add test option');
}
