import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('header muestra el logo de Pablo Martínez', () => {
  const img = page().querySelector('header img');
  assert.ok(img);
  assert.equal(img.getAttribute('alt'), 'Pablo Martínez');
});

test('hero tiene un único h1 con el rol', () => {
  const h1s = page().querySelectorAll('h1');
  assert.equal(h1s.length, 1);
  assert.equal(t(h1s[0]), 'Desarrollador Front-end & diseñador UX');
});

test('hero muestra la bajada y el CTA a WhatsApp', () => {
  const hero = page().querySelector('#inicio');
  assert.match(t(hero), /Ideando productos digitales centrados en los objetivos del usuario\./);
  const cta = hero.querySelector('a');
  assert.equal(t(cta), 'Contáctanos');
  assert.equal(cta.getAttribute('href'), 'https://api.whatsapp.com/send?phone=593995027973');
  assert.ok(isSafeExternal(cta));
});

test('footer muestra nombre y año actual', () => {
  const footer = page().querySelector('footer');
  assert.equal(t(footer), `Pablo Martínez · © ${new Date().getFullYear()}`);
});
