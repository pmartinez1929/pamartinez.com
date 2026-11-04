import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page } from './helpers.mjs';

// Los 14 destinos únicos del sitio Gatsby original (relevados el 2026-11-04)
const original = [
  'https://api.whatsapp.com/send?phone=593995027973',
  'https://blubear.io/',
  'https://www.linkedin.com/in/pmartinezesp/',
  'https://github.com/pmartinez1929',
  'https://www.behance.net/pablomartinez102',
  'https://www.instagram.com/intuyo.dev/',
  'https://1001carros.com/',
  'https://www.oagpro.com/',
  'https://corpo-medica.com/',
  'https://www.figma.com/file/rsOXMJBZT28xMy6sdQzJcG/PetHomie?node-id=11%3A298&t=gMvQ7C8RGV3iCeEp-1',
  'https://www.maxusecuador.com/',
  'https://valiente.pamartinez.com/',
  'https://calendly.com/pmartinez1929/reunion',
  'mailto:pmartinezesp@outlook.com',
];

test('el sitio conserva todos los links del original', () => {
  const hrefs = new Set(page().querySelectorAll('a').map((a) => a.getAttribute('href').replaceAll('&amp;', '&')));
  for (const url of original) assert.ok(hrefs.has(url), `falta ${url}`);
});
