import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const wf = () => readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');

test('workflow despliega dist/ por FTP solo si hay secrets', () => {
  const y = wf();
  assert.match(y, /branches: \[main\]/);
  assert.match(y, /workflow_dispatch/);
  assert.match(y, /npm ci/);
  assert.match(y, /npm test/);
  assert.match(y, /SamKirkland\/FTP-Deploy-Action@v4\.3\.5/);
  assert.match(y, /local-dir: \.\/dist\//);
  assert.match(y, /if: \$\{\{ env\.FTP_SERVER != '' \}\}/);
  for (const s of ['FTP_SERVER', 'FTP_USERNAME', 'FTP_PASSWORD', 'FTP_DIR']) assert.match(y, new RegExp(`secrets\.${s}`));
});

test('README documenta deploy manual y automático', () => {
  const r = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  assert.match(r, /npm run build/);
  assert.match(r, /FTP_SERVER/);
  assert.match(r, /src\/data/);
});
