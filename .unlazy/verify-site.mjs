// Checks the site build against the gates in GATES-site.md.
// Usage: node .unlazy/verify-site.mjs <test|lint|build>
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const site = fileURLToPath(new URL('../site/', import.meta.url));
const fail = (problems) => {
  console.error('FAILED');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
};
// Throws (and so exits nonzero) when the npm script fails.
const npm = (args) => execSync('npm ' + args, { cwd: site, stdio: 'inherit' });

const mode = process.argv[2];
if (!existsSync(site)) fail(['site/ does not exist']);

if (mode === 'test') {
  npm('test');
  console.log('SITE-TESTS-OK');
} else if (mode === 'lint') {
  npm('run lint');
  console.log('SITE-LINT-OK');
} else if (mode === 'build') {
  npm('run build');
  const pages = [
    'index',
    'ending',
    'chapters/louisiana',
    'chapters/sao-paulo',
    'chapters/johannesburg',
    'chapters/tobique',
  ];
  const missing = pages.filter((p) => !existsSync(join(site, '.next', 'server', 'app', p + '.html')));
  if (missing.length) fail(missing.map((p) => 'not prerendered: ' + p));
  console.log('SITE-BUILD-OK');
} else {
  fail(['unknown mode: ' + mode]);
}
