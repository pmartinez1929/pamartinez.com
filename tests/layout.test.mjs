import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page } from './helpers.mjs';

test('index tiene lang es, viewport y título del sitio', () => {
  const doc = page();
  assert.equal(doc.querySelector('html').getAttribute('lang'), 'es');
  assert.ok(doc.querySelector('meta[name="viewport"]'));
  assert.equal(doc.querySelector('title').text, 'Pablo A Martínez | Diseñador de producto y desarrollador');
});

test('index carga la hoja de estilos compilada', () => {
  const doc = page();
  assert.ok(doc.querySelector('link[rel="stylesheet"]') || doc.querySelector('style'));
});

test('las secciones aparecen en el orden nuevo', () => {
  const ids = page().querySelectorAll('main section[id]').map((s) => s.getAttribute('id'));
  assert.deepEqual(ids, ['inicio', 'clientes', 'servicios', 'proceso', 'proyectos', 'intuyo', 'sobre-mi', 'contacto']);
});
