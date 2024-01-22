import { execSync } from 'node:child_process';
import fs from 'node:fs';

const rev = fs.readFileSync('.git/refs/heads/main', 'utf8').trim().slice(0, 7);

const packageJson = fs.readFileSync('package.json', 'utf8');
fs.writeFileSync('package.json', packageJson.replace('"0.2.0"', `"0.2.0-${rev}"`));

console.log(rev, packageJson);

execSync(`npm publish`, { stdio: 'inherit' });

fs.writeFileSync('package.json', packageJson);