import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, distHas, distText } from './helpers.mjs';

test('meta SEO, canonical y Open Graph', () => {
  const doc = page();
  const meta = (sel) => doc.querySelector(sel)?.getAttribute('content');
  assert.match(meta('meta[name="description"]'), /^Ideando productos digitales/);
  assert.equal(doc.querySelector('link[rel="canonical"]').getAttribute('href'), 'https://pamartinez.com/');
  assert.equal(meta('meta[property="og:title"]'), 'Pablo A Martínez | Frontend Developer y UX Designer');
  assert.equal(meta('meta[property="og:url"]'), 'https://pamartinez.com/');
  assert.equal(meta('meta[property="og:image"]'), 'https://pamartinez.com/icons/icon-512x512.png');
  assert.equal(meta('meta[name="twitter:creator"]'), '@pmartinez1929');
  assert.equal(meta('meta[name="theme-color"]'), '#1d3557');
  assert.ok(doc.querySelector('link[rel="manifest"][href="/manifest.webmanifest"]'));
});

test('archivos de hosting y SEO en dist', () => {
  for (const f of ['404.html', 'robots.txt', 'sitemap-index.xml', 'manifest.webmanifest', '.htaccess']) {
    assert.ok(distHas(f), `falta dist/${f}`);
  }
  assert.match(distText('robots.txt'), /Sitemap: https:\/\/pamartinez\.com\/sitemap-index\.xml/);
  const manifest = JSON.parse(distText('manifest.webmanifest'));
  assert.equal(manifest.name, 'Pablo A Martínez');
  assert.notEqual(manifest.short_name, 'starter');
  const htaccess = distText('.htaccess');
  assert.match(htaccess, /ErrorDocument 404 \/404\.html/);
  assert.match(htaccess, /RewriteRule .* https:\/\/%\{HTTP_HOST\}%\{REQUEST_URI\}/);
  assert.match(htaccess, /immutable/);
});

test('404 tiene link de vuelta al inicio', () => {
  const doc = page('404.html');
  assert.ok(doc.querySelector('a[href="/"]'));
  assert.ok(doc.querySelector('meta[name="robots"][content="noindex"]'));
});
