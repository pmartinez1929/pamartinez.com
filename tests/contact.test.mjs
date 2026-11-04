import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('contacto: título, texto y 3 vías', () => {
  const s = page().querySelector('#contacto');
  assert.equal(t(s.querySelector('h2')), '¿Tienes una idea?');
  assert.match(t(s), /conecta/);
  assert.match(t(s), /Conversemos como una idea se puede convertir en una solución digital y como poder llegar a lograrlo\./);
  const links = s.querySelectorAll('a');
  assert.deepEqual(
    links.map((a) => [t(a), a.getAttribute('href')]),
    [
      ['Contactame al Whatsapp', 'https://api.whatsapp.com/send?phone=593995027973'],
      ['Agenda una reunión (gratuita)', 'https://calendly.com/pmartinez1929/reunion'],
      ['Escribe un correo electrónico', 'mailto:pmartinezesp@outlook.com'],
    ],
  );
  assert.ok(isSafeExternal(links[0]) && isSafeExternal(links[1]));
});
