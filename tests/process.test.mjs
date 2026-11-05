import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, sectionHeading } from './helpers.mjs';

test('cómo trabajo: h2 y 4 pasos en lista ordenada', () => {
  const s = page().querySelector('#proceso');
  assert.ok(s);
  assert.deepEqual(sectionHeading(s), { eyebrow: 'Proceso', title: 'Cómo trabajo' });
  assert.match(t(s), /Un proceso simple en 4 pasos, de la idea al producto publicado\./);
  const items = s.querySelectorAll('ol > li');
  assert.equal(items.length, 4);
  assert.deepEqual(
    items.map((li) => t(li.querySelector('h3'))),
    ['Entender', 'Prototipar', 'Construir', 'Lanzar y mejorar'],
  );
  assert.match(t(items[0]), /Conversamos sobre tu idea, tus clientes y el objetivo del negocio\./);
  assert.match(t(items[1]), /Diseño en Figma y lo validamos antes de escribir código\./);
  assert.match(t(items[2]), /Desarrollo con herramientas de IA para avanzar más rápido sin perder calidad\./);
  assert.match(t(items[3]), /Publicamos, medimos cómo lo usan y ajustamos\./);
  for (const li of items) assert.equal(li.querySelector('[aria-hidden="true"]') !== null, true);
});
