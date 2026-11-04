import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

const expected = [
  ['1001 Carros', 'https://1001carros.com/', 'Visitar', 'Nuxt'],
  ['OAG Pro', 'https://www.oagpro.com/', 'Visitar', 'Vue'],
  ['Corpo Médica', 'https://corpo-medica.com/', 'Visitar', 'WordPress'],
  ['PetHomie', 'https://www.figma.com/file/rsOXMJBZT28xMy6sdQzJcG/PetHomie?node-id=11%3A298&t=gMvQ7C8RGV3iCeEp-1', 'Explorar', 'Figma'],
  ['Maxus Ecuador', 'https://www.maxusecuador.com/', 'Visitar', 'Nuxt'],
  ['Valiente', 'https://valiente.pamartinez.com/', 'Visitar', 'CodeIgniter'],
];

test('6 proyectos en orden, con captura, tecnología y CTA', () => {
  const cards = page().querySelectorAll('#proyectos article');
  assert.equal(cards.length, 6);
  cards.forEach((card, i) => {
    const [name, url, cta, tech] = expected[i];
    const a = card.querySelector('a');
    assert.equal(a.getAttribute('href'), url);
    assert.equal(t(a), cta);
    assert.equal(a.getAttribute('aria-label'), `${cta} ${name}`);
    assert.ok(isSafeExternal(a));
    assert.ok(card.querySelector(`img[alt="Captura de ${name}"]`));
    assert.ok(card.querySelector(`img[alt="${tech}"]`));
  });
});
