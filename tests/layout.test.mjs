import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page } from './helpers.mjs';

test('index tiene lang es, viewport y título del sitio', () => {
  const doc = page();
  assert.equal(doc.querySelector('html').getAttribute('lang'), 'es');
  assert.ok(doc.querySelector('meta[name="viewport"]'));
  assert.equal(doc.querySelector('title').text, 'Pablo A Martínez | Frontend Developer y UX Designer');
});

test('index carga la hoja de estilos compilada', () => {
  const doc = page();
  assert.ok(doc.querySelector('link[rel="stylesheet"]') || doc.querySelector('style'));
});
