const fs = require('fs');
const [changelogFile, repoUrl] = process.argv.slice(2);

function run() {
  const rawChangelog = fs.readFileSync(changelogFile).toString();
  const prSectionExpr = /.*(\(#(\d.*)\))$/;

  const lines = rawChangelog.split('\n');
  console.log('LINES', lines);
  const rewrittenLines = lines
    .map(line => {
      try {
        // In commit `whatever (#234)`, extract `(#234)` and `234`
        const [, prSection, prNumber] = prSectionExpr.exec(line);
        // Rewrite line using a URL of the pull request rather than just `(#234)`
        const [lineStart] = line.split(prSection);
        const rewrittenPrSection = `(${repoUrl}/pull/${prNumber})`;
        return [lineStart, rewrittenPrSection].join('');
      } catch (e) {
        return line;
      }
    })
    .join('\n');

  /* eslint-disable-next-line no-console */
  console.log(rewrittenLines);
}

run();
