import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, sectionHeading } from './helpers.mjs';

test('dos servicios con título, descripción e items', () => {
  assert.deepEqual(sectionHeading(page().querySelector('#servicios')), { eyebrow: 'Servicios', title: 'Qué hago' });
  const cards = page().querySelectorAll('#servicios article');
  assert.equal(cards.length, 2);
  assert.equal(t(cards[0].querySelector('h3')), 'Diseño UX');
  assert.match(t(cards[0]), /Ordeno tu idea en pantallas claras y la pruebo con personas reales antes de escribir código\./);
  assert.deepEqual(cards[0].querySelectorAll('li').map(t), [
    'Investigación con usuarios',
    'Prototipos navegables en Figma',
    'Diseño de interfaces (UI)',
  ]);
  assert.equal(t(cards[1].querySelector('h3')), 'Desarrollo digital');
  assert.match(
    t(cards[1]),
    /Convierto el diseño en una web o app rápida, que funciona en cualquier dispositivo y es fácil de mantener\./,
  );
  assert.deepEqual(cards[1].querySelectorAll('li').map(t), [
    'Sitios y aplicaciones web',
    'Apps móviles',
    'Desarrollo acelerado con IA',
  ]);
});

test('he trabajado: título y 5 logos con alt', () => {
  const s = page().querySelector('#clientes');
  assert.deepEqual(sectionHeading(s), { eyebrow: 'Clientes', title: 'He trabajado con' });
  const alts = s.querySelectorAll('img').map((i) => i.getAttribute('alt'));
  assert.deepEqual(alts, ['1001 Carros', 'Herrera', 'Corpo Médica', 'Maret', 'Verde']);
});
