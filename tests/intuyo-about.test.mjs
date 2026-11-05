import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('sección Intuyo con pill, logo, texto, estado y CTA a Instagram', () => {
  const s = page().querySelector('#intuyo');
  assert.ok(s);
  assert.equal(t(s.querySelector('h2')), 'Estoy creando');
  assert.ok(s.querySelector('img[alt="Intuyo"]'));
  assert.match(t(s), /Intuyo es el proyecto que estoy construyendo para analizar, idear y mejorar la experiencia de los usuarios en entornos digitales/);
  assert.match(t(s), /La web de Intuyo está en desarrollo\./);
  const cta = s.querySelector('a');
  assert.equal(t(cta), 'Sigue el proyecto en Instagram');
  assert.equal(cta.getAttribute('href'), 'https://www.instagram.com/intuyo.dev/');
  assert.ok(isSafeExternal(cta));
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

test('quien soy: sin botones de redes', () => {
  assert.equal(page().querySelectorAll('#sobre-mi [data-social]').length, 0);
});
