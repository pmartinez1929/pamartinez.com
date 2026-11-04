import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t } from './helpers.mjs';

test('dos servicios con título, descripción e items', () => {
  const cards = page().querySelectorAll('#servicios article');
  assert.equal(cards.length, 2);
  assert.equal(t(cards[0].querySelector('h3')), 'Desarrollo digital');
  assert.match(t(cards[0]), /He trabajado con varios frameworks Javascript\. \(React, VueJS, Angular\)/);
  assert.deepEqual(cards[0].querySelectorAll('li').map(t), ['Desarrollo web', 'Desarrollo de aplicaciones móviles']);
  assert.equal(t(cards[1].querySelector('h3')), 'Diseño UX');
  assert.match(t(cards[1]), /Utilizo Figma para prototipar y testear\./);
  assert.deepEqual(cards[1].querySelectorAll('li').map(t), [
    'Prototipado y arquitectura',
    'Diseño UI y diseño de interacción',
    'Investigación y testeo',
  ]);
});

test('he trabajado: pill y 5 logos con alt', () => {
  const s = page().querySelector('#clientes');
  assert.equal(t(s.querySelector('h2')), 'He trabajado');
  const alts = s.querySelectorAll('img').map((i) => i.getAttribute('alt'));
  assert.deepEqual(alts, ['1001 Carros', 'Herrera', 'Corpo Médica', 'Maret', 'Verde']);
});
