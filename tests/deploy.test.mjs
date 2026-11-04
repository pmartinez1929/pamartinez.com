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

test('permisos mínimos y checkout sin credenciales', () => {
  const y = wf();
  assert.match(y, /contents: read/);
  assert.match(y, /persist-credentials: false/);
  assert.match(y, /node-version: 24/);
  assert.match(y, /concurrency:/);
});

test('los secrets no son visibles antes del gate (npm ci / npm test)', () => {
  const y = wf();
  const gate = y.indexOf('id: ftp');
  assert.ok(gate > 0, 'existe el paso gate con id ftp');
  assert.ok(y.indexOf('npm test') < gate, 'el gate va después de npm test');
  assert.ok(!y.slice(0, gate).includes('secrets.'), 'ningún secret antes del gate');
  assert.ok(!/^ {4}env:/m.test(y), 'sin env a nivel de job');
});

test('gate valida los cuatro secrets y la barra final de FTP_DIR', () => {
  const y = wf();
  const gate = y.slice(y.indexOf('id: ftp'), y.indexOf('- name: Deploy por FTP'));
  for (const s of VARS) assert.ok(gate.includes(s + ": $" + "{{ secrets." + s + " }}"), `env ${s} desde secrets`);
  assert.match(gate, /enabled=true/);
  assert.match(gate, /enabled=false/);
  assert.match(gate, /GITHUB_OUTPUT/);
  assert.match(gate, /\*\//, 'comprueba que FTP_DIR termina en /');
});

test('deploy y aviso de omitido dependen del gate', () => {
  const y = wf();
  const deploy = y.match(/- name: Deploy por FTP\n\s+if: (.*)\n/);
  assert.ok(deploy, 'el paso de deploy tiene if');
  assert.match(deploy[1], /refs\/heads\/main/);
  assert.match(deploy[1], /steps\.ftp\.outputs\.enabled == 'true'/);
  const skip = y.match(/- name: Deploy omitido\n\s+if: (.*)\n/);
  assert.ok(skip, 'el aviso de omitido tiene if');
  assert.equal(skip[1], '${{ !(github.ref == \'refs/heads/main\' && steps.ftp.outputs.enabled == \'true\') }}');
  assert.match(y, /FTP_DIR sin/);
});

test('README documenta deploy manual y automático', () => {
  const r = read('../README.md');
  assert.match(r, /npm run build/);
  assert.match(r, /FTP_SERVER/);
  assert.match(r, /src\/data/);
  assert.match(r, /page-data/);
  assert.match(r, /curl -I/);
  assert.match(r, /termina en `\/`/);
});
