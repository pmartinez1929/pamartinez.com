import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal, sectionHeading } from './helpers.mjs';

const expected = [
  ['1001 Carros', 'https://1001carros.com/', 'Visitar sitio', 'Nuxt'],
  ['OAG Pro', 'https://www.oagpro.com/', 'Visitar sitio', 'Vue'],
  ['Corpo Médica', 'https://corpo-medica.com/', 'Visitar sitio', 'WordPress'],
  ['PetHomie', 'https://www.figma.com/file/rsOXMJBZT28xMy6sdQzJcG/PetHomie?node-id=11%3A298&t=gMvQ7C8RGV3iCeEp-1', 'Ver prototipo', 'Figma'],
  ['Maxus Ecuador', 'https://www.maxusecuador.com/', 'Visitar sitio', 'Nuxt'],
  ['Valiente', 'https://valiente.pamartinez.com/', 'Visitar sitio', 'CodeIgniter'],
];

test('sección proyectos con título visible', () => {
  const s = page().querySelector('#proyectos');
  assert.deepEqual(sectionHeading(s), { eyebrow: 'Portafolio', title: 'Proyectos' });
  assert.doesNotMatch(s.querySelector('h2').getAttribute('class') ?? '', /\bsr-only\b/);
});

test('6 tarjetas con captura, tecnología, nombre y un solo link', () => {
  const cards = page().querySelectorAll('#proyectos article');
  assert.equal(cards.length, 6);
  cards.forEach((card, i) => {
    const [name, url, label, tech] = expected[i];
    assert.ok(card.querySelector(`img[alt="Captura de ${name}"]`));
    assert.equal(t(card.querySelector('p')), tech);
    assert.equal(t(card.querySelector('h3')), name);
    const links = card.querySelectorAll('a');
    assert.equal(links.length, 1);
    const a = links[0];
    assert.equal(a.getAttribute('href').replaceAll('&amp;', '&'), url);
    assert.equal(t(a), `${label} →`);
    assert.equal(a.getAttribute('aria-label'), `${label} de ${name}`);
    assert.ok(isSafeExternal(a));
  });
});

test('sin description, la tarjeta solo tiene el párrafo de tecnología', () => {
  for (const card of page().querySelectorAll('#proyectos article')) {
    assert.equal(card.querySelectorAll('p').length, 1);
  }
});
