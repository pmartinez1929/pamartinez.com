import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('header muestra el logo de Pablo Martínez', () => {
  const img = page().querySelector('header img');
  assert.ok(img);
  assert.equal(img.getAttribute('alt'), 'Pablo Martínez');
});

test('hero tiene un único h1 con el rol', () => {
  const h1s = page().querySelectorAll('h1');
  assert.equal(h1s.length, 1);
  assert.equal(t(h1s[0]), 'Diseñador de producto & desarrollador');
});

test('hero muestra la bajada y el CTA a WhatsApp', () => {
  const hero = page().querySelector('#inicio');
  assert.match(t(hero), /Combino diseño UX, desarrollo y herramientas de IA para llevar tu idea a una web o app real/);
  const cta = hero.querySelector('a');
  assert.equal(t(cta), 'Hablemos');
  assert.equal(cta.getAttribute('href'), 'https://api.whatsapp.com/send?phone=593995027973&text=Hola%20Pablo%2C%20vi%20tu%20web%20y%20quiero%20conversar%20sobre%20un%20proyecto.');
  assert.ok(isSafeExternal(cta));
});

test('footer muestra redes, Intuyo, correo, nombre y año actual', () => {
  const footer = page().querySelector('footer');
  const expected = [
    ['LinkedIn', 'https://www.linkedin.com/in/pmartinezesp/'],
    ['GitHub', 'https://github.com/pmartinez1929'],
    ['Behance', 'https://www.behance.net/pablomartinez102'],
    ['Intuyo', 'https://www.instagram.com/intuyo.dev/'],
  ];
  const social = footer.querySelectorAll('nav a');
  assert.deepEqual(social.map((a) => [a.getAttribute('aria-label'), a.getAttribute('href')]), expected);
  for (const a of social) {
    assert.ok(isSafeExternal(a));
    assert.equal(t(a), '', 'solo ícono, sin texto visible');
    assert.equal(a.querySelector('svg')?.getAttribute('aria-hidden'), 'true');
  }
  const iso = footer.querySelector('a[href="#inicio"]');
  assert.equal(iso?.getAttribute('aria-label'), 'Volver al inicio');
  assert.ok(iso.querySelector('img'));
  const mail = footer.querySelector('a[href="mailto:hola@pamartinez.com"]');
  assert.ok(mail);
  assert.equal(t(mail), 'hola@pamartinez.com');
  assert.equal(t(footer.querySelector('p')), `Pablo Martínez · © ${new Date().getFullYear()}`);
});

test('header fijo con 4 anclas y CTA a WhatsApp', () => {
  const header = page().querySelector('header');
  assert.match(header.getAttribute('class'), /\bsticky\b/);
  const nav = header.querySelector('nav[aria-label="Secciones"]');
  assert.deepEqual(
    nav.querySelectorAll('a').map((a) => [t(a), a.getAttribute('href')]),
    [
      ['Servicios', '#servicios'],
      ['Proyectos', '#proyectos'],
      ['Intuyo', '#intuyo'],
      ['Contacto', '#contacto'],
    ],
  );
  const cta = [...header.querySelectorAll('a')].find((a) => t(a) === 'Hablemos');
  assert.ok(cta);
  assert.match(cta.getAttribute('href'), /^https:\/\/api\.whatsapp\.com\/send\?phone=593995027973&text=/);
  assert.ok(isSafeExternal(cta));
});

test('hero: Hablemos y Ver proyectos del mismo ancho, el secundario en navy', () => {
  const links = page().querySelectorAll('#inicio a');
  assert.equal(links.length, 2);
  const [primary, secondary] = links;
  assert.equal(t(primary), 'Hablemos');
  assert.equal(t(secondary), 'Ver proyectos →');
  assert.equal(secondary.getAttribute('href'), '#proyectos');
  assert.match(secondary.getAttribute('class'), /\bbtn-navy\b/);
  for (const a of links) assert.match(a.getAttribute('class'), /sm:min-w-\[190px\]/);
  assert.match(primary.parentNode.getAttribute('class'), /\bgrid\b/);
  assert.match(primary.parentNode.getAttribute('class'), /sm:grid-cols-2/);
  assert.equal(page().querySelectorAll('.btn-outline').length, 0);
});

test('css: scroll-padding para el header fijo y smooth solo sin reduced-motion', async () => {
  const { readdirSync, readFileSync } = await import('node:fs');
  const dir = new URL('../dist/_astro/', import.meta.url);
  const css = readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
  assert.match(css, /scroll-padding-top:\s*96px/);
  assert.match(css, /prefers-reduced-motion:\s*no-preference\)[^}]*\{[^}]*scroll-behavior:\s*smooth/);
});
