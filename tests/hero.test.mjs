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
  assert.equal(t(h1s[0]), 'Diseñador de producto & desarrollador');
});

test('hero muestra la bajada y el CTA a WhatsApp', () => {
  const hero = page().querySelector('#inicio');
  assert.match(t(hero), /Combino diseño UX, desarrollo y herramientas de IA para llevar tu idea a una web o app real/);
  const cta = hero.querySelector('a');
  assert.equal(t(cta), 'Hablemos');
  assert.equal(cta.getAttribute('href'), 'https://api.whatsapp.com/send?phone=593995027973&text=Hola%20Pablo%2C%20vi%20tu%20web%20y%20quiero%20conversar%20sobre%20un%20proyecto.');
  assert.ok(isSafeExternal(cta));
});

test('footer muestra redes, Intuyo, correo, nombre y año actual', () => {
  const footer = page().querySelector('footer');
  const expected = [
    ['LinkedIn', 'https://www.linkedin.com/in/pmartinezesp/'],
    ['GitHub', 'https://github.com/pmartinez1929'],
    ['Behance', 'https://www.behance.net/pablomartinez102'],
    ['Intuyo', 'https://www.instagram.com/intuyo.dev/'],
  ];
  const social = footer.querySelectorAll('nav a');
  assert.deepEqual(social.map((a) => [t(a), a.getAttribute('href')]), expected);
  for (const a of social) assert.ok(isSafeExternal(a));
  const mail = footer.querySelector('a[href="mailto:hola@pamartinez.com"]');
  assert.ok(mail);
  assert.equal(t(mail), 'hola@pamartinez.com');
  assert.equal(t(footer.querySelector('p')), `Pablo Martínez · © ${new Date().getFullYear()}`);
});
