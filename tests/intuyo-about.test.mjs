import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('sección Intuyo con pill, logo y texto', () => {
  const s = page().querySelector('#intuyo');
  assert.ok(s);
  assert.match(t(s), /^Estoy creando/);
  assert.equal(t(s.querySelector('h2')), 'Estoy creando');
  assert.ok(s.querySelector('img[alt="Intuyo"]'));
  assert.match(t(s), /Intuyo es el proyecto que estoy construyendo para analizar, idear y mejorar la experiencia de los usuarios en entornos digitales/);
});

test('quien soy: foto, bio con Blubear y texto', () => {
  const s = page().querySelector('#sobre-mi');
  assert.ok(s);
  assert.ok(s.querySelector('h2'));
  assert.equal(t(s.querySelector('h2')), 'Quién soy');
  assert.ok(s.querySelector('img[alt="Foto de Pablo Martínez"]'));
  assert.match(t(s), new RegExp(`Soy Pablo Martínez, desarrollador Front-end con más de ${new Date().getFullYear() - 2015} años de experiencia creando productos digitales para distintas marcas\\. Actualmente trabajo en Blubear\\.io`));
  const blubear = s.querySelector('a[href="https://blubear.io/"]');
  assert.ok(blubear && isSafeExternal(blubear));
  assert.match(t(s), /Soy curioso y autodidacta/);
});

test('quien soy: 4 redes con links seguros', () => {
  const expected = {
    LinkedIn: 'https://www.linkedin.com/in/pmartinezesp/',
    GitHub: 'https://github.com/pmartinez1929',
    Behance: 'https://www.behance.net/pablomartinez102',
    Instagram: 'https://www.instagram.com/intuyo.dev/',
  };
  const links = page().querySelectorAll('#sobre-mi [data-social]');
  assert.equal(links.length, 4);
  for (const a of links) {
    assert.equal(a.getAttribute('href'), expected[t(a)]);
    assert.ok(isSafeExternal(a));
  }
});
