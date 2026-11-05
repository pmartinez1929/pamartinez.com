import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('contacto: título, texto y 3 vías', () => {
  const s = page().querySelector('#contacto');
  assert.equal(t(s.querySelector('h2')), '¿Tienes una idea?');
  assert.match(t(s), /conecta/);
  assert.match(t(s), /Conversemos sobre cómo convertir tu idea en una solución digital y qué pasos necesitas para lograrlo\./);
  const links = s.querySelectorAll('a');
  assert.deepEqual(
    links.map((a) => [t(a), a.getAttribute('href')]),
    [
      ['Escríbeme por WhatsApp', 'https://api.whatsapp.com/send?phone=593995027973&text=Hola%20Pablo%2C%20vi%20tu%20web%20y%20quiero%20conversar%20sobre%20un%20proyecto.'],
      ['Agenda una reunión gratuita', 'https://calendly.com/pmartinez1929/reunion'],
      ['Escríbeme un correo', 'mailto:hola@pamartinez.com'],
    ],
  );
  assert.ok(isSafeExternal(links[0]) && isSafeExternal(links[1]));
});
