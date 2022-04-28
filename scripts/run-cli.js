const { execSync } = require('child_process');

const isWin = process.platform === 'win32';
const args = process.argv.slice(2).join(' ');

if (isWin) {
  execSync(`studio.bat ${args}`, { stdio: 'inherit' });
} else {
  execSync(`./studio.sh ${args}`, { stdio: 'inherit' });
}
