import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t } from './helpers.mjs';

const GTM = 'https://www.googletagmanager.com/gtm.js?id=GTM-5NMPVG2G';

for (const path of ['index.html', '404.html', 'privacidad/index.html']) {
  test(`${path}: consentimiento denegado por defecto antes de cargar GTM`, () => {
    const head = page(path).querySelector('head');
    const scripts = head.querySelectorAll('script');
    const consent = scripts.findIndex((s) => /gtag\('consent',\s*'default'/.test(s.text));
    const loader = scripts.findIndex((s) => s.getAttribute('src') === GTM);
    assert.ok(consent >= 0, 'falta el consent default');
    assert.ok(loader > consent, 'GTM debe cargar después del consent default');
    assert.ok(scripts[loader].hasAttribute('async'));
    for (const k of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) {
      assert.match(scripts[consent].text, new RegExp(`${k}:\\s*'denied'`));
    }
  });
}

test('banner de consentimiento oculto por defecto, con Aceptar y Rechazar', () => {
  const banner = page().querySelector('#consent');
  assert.ok(banner);
  assert.ok(banner.hasAttribute('hidden'));
  assert.equal(banner.getAttribute('aria-label'), 'Consentimiento de cookies');
  const buttons = banner.querySelectorAll('button');
  assert.deepEqual(
    buttons.map((b) => [t(b), b.getAttribute('data-consent')]),
    [
      ['Rechazar', 'denied'],
      ['Aceptar', 'granted'],
    ],
  );
  assert.ok(banner.querySelector('a[href="/privacidad/"]'));
});

test('footer permite reabrir las preferencias de cookies y enlaza la privacidad', () => {
  const footer = page().querySelector('footer');
  const btn = footer.querySelector('button[data-consent-open]');
  assert.equal(t(btn), 'Preferencias de cookies');
  assert.ok(footer.querySelector('a[href="/privacidad/"]'));
});

test('página de privacidad: h1, herramientas, derechos y contacto', () => {
  const doc = page('privacidad/index.html');
  assert.equal(t(doc.querySelector('h1')), 'Política de privacidad');
  const text = t(doc.querySelector('main'));
  for (const s of ['Google Tag Manager', 'Google Analytics', 'Microsoft Clarity', 'LOPDP', 'hola@pamartinez.com']) {
    assert.ok(text.includes(s), `falta "${s}"`);
  }
  assert.ok(doc.querySelector('main button[data-consent-open]'));
});

test('enlaces medibles tienen data-track y data-track-label', () => {
  const doc = page();
  const tracked = (sel) => doc.querySelectorAll(sel).map((a) => [a.getAttribute('data-track'), a.getAttribute('data-track-label')]);
  assert.deepEqual(tracked('header a[data-track]'), [['whatsapp', 'header']]);
  assert.deepEqual(tracked('#inicio a[data-track]'), [['whatsapp', 'hero']]);
  assert.deepEqual(tracked('#contacto a[data-track]'), [
    ['whatsapp', 'contacto'],
    ['calendly', 'contacto'],
    ['email', 'contacto'],
  ]);
  assert.deepEqual(tracked('footer a[data-track]'), [
    ['social', 'LinkedIn'],
    ['social', 'GitHub'],
    ['social', 'Behance'],
    ['social', 'Intuyo'],
    ['email', 'footer'],
  ]);
  assert.deepEqual(tracked('#intuyo a[data-track]'), [['social', 'Intuyo']]);
  assert.deepEqual(tracked('#sobre-mi a[data-track]'), [['externo', 'Blubear.io']]);
  const projects = doc.querySelectorAll('#proyectos a');
  assert.ok(projects.length > 0);
  for (const a of projects) {
    assert.equal(a.getAttribute('data-track'), 'proyecto');
    assert.ok(a.getAttribute('data-track-label'));
  }
});

test('el isotipo del footer vuelve al inicio desde cualquier página', () => {
  assert.ok(page('privacidad/index.html').querySelector('footer a[href="/#inicio"]'));
});
