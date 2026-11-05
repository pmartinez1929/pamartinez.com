import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, sectionHeading } from './helpers.mjs';

test('dos servicios con título, descripción e items', () => {
  assert.deepEqual(sectionHeading(page().querySelector('#servicios')), { eyebrow: 'Servicios', title: 'Qué hago' });
  const cards = page().querySelectorAll('#servicios article');
  assert.equal(cards.length, 2);
  assert.equal(t(cards[0].querySelector('h3')), 'Desarrollo digital');
  assert.match(t(cards[0]), /Construyo webs y aplicaciones rápidas y fáciles de mantener con React, Vue y Angular\./);
  assert.deepEqual(cards[0].querySelectorAll('li').map(t), ['Desarrollo web', 'Desarrollo de aplicaciones móviles']);
  assert.equal(t(cards[1].querySelector('h3')), 'Diseño UX');
  assert.match(t(cards[1]), /Uso Figma para prototipar y validar con usuarios antes de desarrollar\./);
  assert.deepEqual(cards[1].querySelectorAll('li').map(t), [
    'Prototipado y arquitectura de información',
    'Diseño UI y diseño de interacción',
    'Investigación y testeo',
  ]);
});

test('he trabajado: título y 5 logos con alt', () => {
  const s = page().querySelector('#clientes');
  assert.deepEqual(sectionHeading(s), { eyebrow: 'Clientes', title: 'He trabajado con' });
  const alts = s.querySelectorAll('img').map((i) => i.getAttribute('alt'));
  assert.deepEqual(alts, ['1001 Carros', 'Herrera', 'Corpo Médica', 'Maret', 'Verde']);
});
