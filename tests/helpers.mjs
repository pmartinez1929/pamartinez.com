import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'node-html-parser';

const dist = new URL('../dist/', import.meta.url);

export function page(path = 'index.html') {
  return parse(readFileSync(new URL(path, dist), 'utf8'));
}

export function distHas(path) {
  return existsSync(new URL(path, dist));
}

export function distText(path) {
  return readFileSync(new URL(path, dist), 'utf8');
}

/** Texto visible normalizado (entidades decodificadas, espacios colapsados). */
export function t(el) {
  return el.text.replace(/\s+/g, ' ').trim();
}

/** Asserta que un <a> externo abre en pestaña nueva de forma segura. */
export function isSafeExternal(a) {
  const rel = (a.getAttribute('rel') ?? '').split(/\s+/);
  return a.getAttribute('target') === '_blank' && rel.includes('noopener') && rel.includes('noreferrer');
}

/** Etiqueta y título del SectionHeading de una sección. */
export function sectionHeading(section) {
  const wrap = section.querySelector('[data-section-heading]');
  return { eyebrow: t(wrap.querySelector('p')), title: t(wrap.querySelector('h2')) };
}
