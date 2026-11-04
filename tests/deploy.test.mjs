import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const wf = () => read('../.github/workflows/deploy.yml');
const VARS = ['FTP_SERVER', 'FTP_USERNAME', 'FTP_PASSWORD', 'FTP_DIR'];

test('workflow despliega dist/ por FTP solo si hay secrets', () => {
  const y = wf();
  assert.match(y, /branches: \[main\]/);
  assert.match(y, /workflow_dispatch/);
  assert.match(y, /npm ci/);
  assert.match(y, /npm test/);
  assert.match(y, /SamKirkland\/FTP-Deploy-Action@v4\.3\.5/);
  assert.match(y, /local-dir: \.\/dist\//);
  for (const s of VARS) assert.match(y, new RegExp(`secrets\.${s}`));
});

test('deploy solo desde main y con los cuatro secrets; permisos mínimos', () => {
  const y = wf();
  assert.match(y, /contents: read/);
  assert.match(y, /persist-credentials: false/);
  const deploy = y.match(/- name: Deploy por FTP\n\s+if: (.*)\n/);
  assert.ok(deploy, 'el paso de deploy tiene if');
  assert.match(deploy[1], /refs\/heads\/main/);
  for (const s of VARS) assert.match(deploy[1], new RegExp(`env\.${s} != ''`));
  const skip = y.match(/- name: Deploy omitido\n\s+if: (.*)\n/);
  assert.ok(skip, 'el aviso de omitido tiene if');
  assert.match(skip[1], /!\(/);
  for (const s of VARS) assert.ok(y.includes(s + ": $" + "{{ secrets." + s + " }}"), `env ${s} desde secrets`);
});

test('README documenta deploy manual y automático', () => {
  const r = read('../README.md');
  assert.match(r, /npm run build/);
  assert.match(r, /FTP_SERVER/);
  assert.match(r, /src\/data/);
});
