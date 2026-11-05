# Reestructura de secciones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reordenar la one-page de pamartinez.com y agregar tres cosas: un header fijo con anclas, la sección "Cómo trabajo" y un CTA en Intuyo. Las redes pasan al footer y WhatsApp queda como contacto principal.

**Architecture:** El sitio es Astro estático, sin JS en el cliente. Cada sección es un componente `.astro` independiente que lee sus textos de `src/data/*.ts`, y `src/pages/index.astro` define el orden. Los tests (`node:test` con `node-html-parser`) inspeccionan `dist/index.html` después de `astro build`.

**Tech Stack:** Astro 7.4.5, Tailwind CSS 4.3.4 (`@tailwindcss/vite`), TypeScript, `node:test`, `node-html-parser`.

**Spec:** `docs/superpowers/specs/2026-11-05-estructura-design.md`

## Global Constraints

- Cero JavaScript en el cliente: nada de `<script>`, todo con HTML y CSS.
- Todo link externo lleva `target="_blank" rel="noopener noreferrer"`, verificado con `isSafeExternal` de `tests/helpers.mjs`.
- Textos en español exactamente como aparecen en este plan, con tildes.
- `tests/links.test.mjs` no se modifica: todos sus destinos tienen que seguir presentes en la página.
- Archivos con fin de línea LF (`.gitattributes` lo fuerza).
- Ejecutar todos los tests: `npm test` (hace `astro build` y luego `node --test "tests/**/*.test.mjs"`).
- Ejecutar un solo archivo: `npm run build && node --test tests/<archivo>.test.mjs`.
- Type-check: `npm run check` → 0 errors.
- Cada commit termina con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- No hacer `git push`.
- Colores Tailwind disponibles: `navy`, `red`, `aqua`, `blue`, `cream`, `muted`. Tipografías: `font-display` (Vidaloka) y `font-sans` (Quicksand).
- Clases de componentes en `src/styles/global.css` (`@layer components`): `.pill`, `.btn`, `.btn-red`, `.btn-cream`.
- `BaseLayout` envuelve la página en `<div class="overflow-clip">`. `overflow: clip` no crea contenedor de scroll, así que `position: sticky` funciona dentro. No cambiarlo a `overflow-hidden`.

## File Structure

| Archivo | Responsabilidad | Tareas |
|---|---|---|
| `src/data/site.ts` | Textos y links del sitio | 1–4 |
| `src/data/process.ts` (nuevo) | Pasos de "Cómo trabajo" | 2 |
| `src/data/projects.ts` | Proyectos (`description?`) | 5 |
| `src/components/Footer.astro` | Redes, Intuyo, correo y copyright | 1 |
| `src/components/Intuyo.astro` | Sección Intuyo con estado y CTA | 1 |
| `src/components/About.astro` | Quién soy (sin redes ni slot) | 1, 3 |
| `src/components/Process.astro` (nuevo) | Cómo trabajo | 2 |
| `src/components/Clients.astro` | Logos, sección propia | 3 |
| `src/components/Services.astro` | Qué hago, sección propia | 3 |
| `src/pages/index.astro` | Orden de secciones | 2, 3 |
| `src/components/Header.astro` | Header fijo con anclas y CTA | 4 |
| `src/components/Hero.astro` | Botón secundario | 4 |
| `src/styles/global.css` | `.btn-outline`, scroll-padding, smooth | 4 |
| `src/components/Contact.astro` | WhatsApp como botón principal | 5 |
| `src/components/ProjectCard.astro` | Descripción opcional | 5 |

---

### Task 1: Redes e Intuyo en el footer, CTA de Intuyo y Quién soy sin redes

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/Intuyo.astro`
- Modify: `src/components/About.astro`
- Test: `tests/intuyo-about.test.mjs`, `tests/hero.test.mjs` (test del footer)

**Interfaces:**
- Produces: `site.intuyo.status: string`, `site.intuyo.instagram: string`, `site.intuyo.ctaLabel: string`. `site.socials` queda con 3 elementos (LinkedIn, GitHub, Behance).

- [ ] **Step 1: Escribir los tests que fallan**

En `tests/intuyo-about.test.mjs`, reemplazar el test `'sección Intuyo con pill, logo y texto'` y el test `'quien soy: 4 redes con links seguros'` por:

```js
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

test('quien soy: sin botones de redes', () => {
  assert.equal(page().querySelectorAll('#sobre-mi [data-social]').length, 0);
});
```

En `tests/hero.test.mjs`, reemplazar el test `'footer muestra nombre y año actual'` por:

```js
test('footer muestra redes, Intuyo, correo, nombre y año actual', () => {
  const footer = page().querySelector('footer');
  const expected = [
    ['LinkedIn', 'https://www.linkedin.com/in/pmartinezesp/'],
    ['GitHub', 'https://github.com/pmartinez1929'],
    ['Behance', 'https://www.behance.net/pablomartinez102'],
    ['Intuyo', 'https://www.instagram.com/intuyo.dev/'],
  ];
  const social = footer.querySelectorAll('nav a');
  assert.deepEqual(social.map((a) => [t(a), a.getAttribute('href')]), expected);
  for (const a of social) assert.ok(isSafeExternal(a));
  const mail = footer.querySelector('a[href="mailto:hola@pamartinez.com"]');
  assert.ok(mail);
  assert.equal(t(mail), 'hola@pamartinez.com');
  assert.equal(t(footer.querySelector('p')), `Pablo Martínez · © ${new Date().getFullYear()}`);
});
```

- [ ] **Step 2: Comprobar que fallan**

Run: `npm run build && node --test tests/intuyo-about.test.mjs tests/hero.test.mjs`
Expected: FAIL en los tests de Intuyo, quien soy sin redes y footer.

- [ ] **Step 3: Datos en `src/data/site.ts`**

Reemplazar el bloque `intuyo` por:

```ts
  intuyo: {
    label: 'Estoy creando',
    text: 'Intuyo es el proyecto que estoy construyendo para analizar, idear y mejorar la experiencia de los usuarios en entornos digitales: sistemas que cumplen los objetivos del negocio y están pensados para las personas que los usan.',
    status: 'La web de Intuyo está en desarrollo.',
    instagram: 'https://www.instagram.com/intuyo.dev/',
    ctaLabel: 'Sigue el proyecto en Instagram',
  },
```

Y quitar de `socials` la línea `{ label: 'Instagram', url: 'https://www.instagram.com/intuyo.dev/' },`.

- [ ] **Step 4: `src/components/Footer.astro` completo**

```astro
---
import { site } from '../data/site';
const year = new Date().getFullYear();
const links = [...site.socials, { label: 'Intuyo', url: site.intuyo.instagram }];
---

<footer class="relative bg-navy px-4 py-8 text-center text-white">
  <nav aria-label="Redes" class="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-2 font-medium">
    {
      links.map((l) => (
        <a class="hover:text-aqua focus-visible:outline-white" href={l.url} target="_blank" rel="noopener noreferrer">
          {l.label}
        </a>
      ))
    }
  </nav>
  <a class="mb-4 inline-block hover:text-aqua focus-visible:outline-white" href={`mailto:${site.contact.email}`}>
    {site.contact.email}
  </a>
  <p>{site.name} &nbsp;·&nbsp; © {year}</p>
</footer>
```

El `focus-visible:outline-white` hace falta porque el outline global es navy y no se vería sobre el fondo navy.

- [ ] **Step 5: `src/components/Intuyo.astro`**

Reemplazar la línea `<p class="mt-5 mb-[50px] max-w-[80%] text-center">{site.intuyo.text}</p>` por:

```astro
    <p class="mt-5 max-w-[80%] text-center">{site.intuyo.text}</p>
    <p class="mt-3 text-sm">{site.intuyo.status}</p>
    <a class="btn btn-red mt-6 mb-[50px]" href={site.intuyo.instagram} target="_blank" rel="noopener noreferrer">
      {site.intuyo.ctaLabel}
    </a>
```

- [ ] **Step 6: `src/components/About.astro` sin redes**

Borrar el `<div class="flex flex-col gap-2">…</div>` completo que hace `site.socials.map(...)` con `data-social`, y cambiar `md:grid-cols-[110px_1fr_170px]` por `md:grid-cols-[110px_1fr]`. No tocar nada más en esta tarea.

- [ ] **Step 7: Comprobar que pasan**

Run: `npm test`
Expected: PASS en todos (incluye `links.test.mjs`: LinkedIn, GitHub, Behance e Instagram siguen presentes).

- [ ] **Step 8: Commit**

```bash
git add src/data/site.ts src/components/Footer.astro src/components/Intuyo.astro src/components/About.astro tests/intuyo-about.test.mjs tests/hero.test.mjs
git commit -m "feat: redes en el footer y CTA de Intuyo a Instagram

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Sección "Cómo trabajo"

**Files:**
- Create: `src/data/process.ts`
- Create: `src/components/Process.astro`
- Create: `tests/process.test.mjs`
- Modify: `src/data/site.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `export interface Step { number: string; title: string; text: string }` y `export const steps: Step[]` en `src/data/process.ts`; `site.processLabel: string`; componente `Process.astro` que renderiza `<section id="proceso">`.

- [ ] **Step 1: Escribir el test que falla**

Crear `tests/process.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t } from './helpers.mjs';

test('cómo trabajo: h2 y 4 pasos en lista ordenada', () => {
  const s = page().querySelector('#proceso');
  assert.ok(s);
  assert.equal(t(s.querySelector('h2')), 'Cómo trabajo');
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
```

- [ ] **Step 2: Comprobar que falla**

Run: `npm run build && node --test tests/process.test.mjs`
Expected: FAIL (`#proceso` no existe).

- [ ] **Step 3: Crear `src/data/process.ts`**

```ts
export interface Step {
  number: string;
  title: string;
  text: string;
}

// Se llama `steps` (no `process`) para no chocar con el global `process` de Node
export const steps: Step[] = [
  { number: '01', title: 'Entender', text: 'Conversamos sobre tu idea, tus clientes y el objetivo del negocio.' },
  { number: '02', title: 'Prototipar', text: 'Diseño en Figma y lo validamos antes de escribir código.' },
  { number: '03', title: 'Construir', text: 'Desarrollo con herramientas de IA para avanzar más rápido sin perder calidad.' },
  { number: '04', title: 'Lanzar y mejorar', text: 'Publicamos, medimos cómo lo usan y ajustamos.' },
];
```

- [ ] **Step 4: Agregar a `src/data/site.ts`**

Debajo de `projectsLabel: 'Proyectos',`:

```ts
  processLabel: 'Cómo trabajo',
```

- [ ] **Step 5: Crear `src/components/Process.astro`**

```astro
---
import { steps } from '../data/process';
import { site } from '../data/site';
---

<section id="proceso" class="mx-auto max-w-[860px] px-6 py-16 md:px-0">
  <div class="flex justify-center">
    <h2 class="pill bg-aqua">{site.processLabel}</h2>
  </div>
  <ol class="mt-8 grid gap-10 md:grid-cols-4 md:gap-6">
    {
      steps.map((s) => (
        <li class="flex flex-col">
          <span aria-hidden="true" class="font-display text-5xl leading-none text-aqua">
            {s.number}
          </span>
          <h3 class="mt-3 font-display text-xl font-bold text-navy">{s.title}</h3>
          <p class="mt-2">{s.text}</p>
        </li>
      ))
    }
  </ol>
</section>
```

- [ ] **Step 6: Insertar en `src/pages/index.astro` (posición provisional; la Tarea 3 fija el orden final)**

Agregar `import Process from '../components/Process.astro';` junto a los otros imports, y `<Process />` justo después de `</About>` y antes de `<Projects />`.

- [ ] **Step 7: Comprobar que pasan**

Run: `npm test`
Expected: PASS en todos.

- [ ] **Step 8: Commit**

```bash
git add src/data/process.ts src/components/Process.astro src/data/site.ts src/pages/index.astro tests/process.test.mjs
git commit -m "feat: sección Cómo trabajo con 4 pasos

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Orden nuevo y secciones independientes (Clientes, Servicios, Quién soy)

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/About.astro`
- Modify: `src/components/Clients.astro`
- Modify: `src/components/Services.astro`
- Modify: `src/data/site.ts`
- Test: `tests/layout.test.mjs`, `tests/services-clients.test.mjs`

**Interfaces:**
- Consumes: `Process.astro` (Tarea 2).
- Produces: `site.servicesLabel: string`; `site.clientsLabel` pasa a `'He trabajado con'`; `About.astro` ya no tiene `<slot />`.

- [ ] **Step 1: Escribir los tests que fallan**

Agregar al final de `tests/layout.test.mjs`:

```js
test('las secciones aparecen en el orden nuevo', () => {
  const ids = page().querySelectorAll('main section[id]').map((s) => s.getAttribute('id'));
  assert.deepEqual(ids, ['inicio', 'clientes', 'servicios', 'proceso', 'proyectos', 'intuyo', 'sobre-mi', 'contacto']);
});
```

En `tests/services-clients.test.mjs`:
- En el test `'he trabajado: pill y 5 logos con alt'`, cambiar `'He trabajado'` por `'He trabajado con'`.
- Agregar al inicio del test `'dos servicios con título, descripción e items'`:

```js
  assert.equal(t(page().querySelector('#servicios h2')), 'Qué hago');
```

- [ ] **Step 2: Comprobar que fallan**

Run: `npm run build && node --test tests/layout.test.mjs tests/services-clients.test.mjs`
Expected: FAIL (orden, label y h2 de servicios).

- [ ] **Step 3: `src/data/site.ts`**

Cambiar `clientsLabel: 'He trabajado',` por `clientsLabel: 'He trabajado con',` y agregar debajo:

```ts
  servicesLabel: 'Qué hago',
```

- [ ] **Step 4: `src/components/Clients.astro` completo**

```astro
---
import { Image } from 'astro:assets';
import { clients } from '../data/clients';
import { site } from '../data/site';
---

<section id="clientes" class="mx-auto max-w-[860px] px-6 pt-6 md:px-0">
  <div class="flex justify-center">
    <h2 class="pill bg-aqua">{site.clientsLabel}</h2>
  </div>
  <div class="grid grid-cols-2 py-6 md:grid-cols-5">
    {
      clients.map((c) => (
        <div class="flex items-center justify-center p-6">
          <Image
            src={c.logo}
            alt={c.name}
            class="opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
          />
        </div>
      ))
    }
  </div>
</section>
```

- [ ] **Step 5: `src/components/Services.astro`**

Reemplazar la línea de apertura `<section id="servicios" class="my-16 grid gap-16 md:grid-cols-2 md:gap-4">` y su cierre `</section>` para que la sección quede así (el contenido de `services.map(...)` no cambia):

```astro
---
import { Image } from 'astro:assets';
import { services } from '../data/services';
import { site } from '../data/site';
---

<section id="servicios" class="mx-auto my-16 max-w-[860px] px-6 md:px-0">
  <div class="flex justify-center">
    <h2 class="pill bg-aqua">{site.servicesLabel}</h2>
  </div>
  <div class="mt-12 grid gap-16 md:grid-cols-2 md:gap-4">
    {/* …mismo services.map(...) que hoy, sin cambios… */}
  </div>
</section>
```

El comentario `{/* … */}` de arriba solo indica dónde va el bloque existente: hay que mover el `services.map((s) => (<article …>…</article>))` actual tal cual dentro del `<div class="mt-12 …">`, no dejar el comentario.

- [ ] **Step 6: `src/components/About.astro` sin slot ni círculo inferior**

- Borrar el primer `<img src="/svg/circles-red.svg" … class="… top-[834px] -right-[60px] hidden w-[252px] md:block" />`, que estaba pensado para la altura del bloque con Servicios y Clientes.
- Borrar la línea `<slot />`.
- Se mantienen el círculo `-top-[154px] -left-[266px]`, la pill, la foto y los dos párrafos.

- [ ] **Step 7: `src/pages/index.astro` completo**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Clients from '../components/Clients.astro';
import Services from '../components/Services.astro';
import Process from '../components/Process.astro';
import Projects from '../components/Projects.astro';
import Intuyo from '../components/Intuyo.astro';
import About from '../components/About.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout>
  <Header />
  <main>
    <Hero />
    <Clients />
    <Services />
    <Process />
    <Projects />
    <Intuyo />
    <About />
    <Contact />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 8: Comprobar que pasan**

Run: `npm test && npm run check`
Expected: todos PASS; check con 0 errors.

- [ ] **Step 9: Commit**

```bash
git add src/pages/index.astro src/components/About.astro src/components/Clients.astro src/components/Services.astro src/data/site.ts tests/layout.test.mjs tests/services-clients.test.mjs
git commit -m "feat: nuevo orden de secciones con clientes bajo el hero

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Header fijo con anclas y botón secundario en el hero

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/styles/global.css`
- Modify: `src/data/site.ts`
- Test: `tests/hero.test.mjs`

**Interfaces:**
- Produces: `site.nav: { label: string; href: string }[]`, `site.hero.secondaryCta: string`, clase CSS `.btn-outline`.

- [ ] **Step 1: Escribir los tests que fallan**

Agregar a `tests/hero.test.mjs`:

```js
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

test('hero tiene botón secundario a proyectos', () => {
  const link = page().querySelector('#inicio a[href="#proyectos"]');
  assert.ok(link);
  assert.equal(t(link), 'Ver proyectos');
});

test('css: scroll-padding para el header fijo y smooth solo sin reduced-motion', async () => {
  const { readdirSync, readFileSync } = await import('node:fs');
  const dir = new URL('../dist/_astro/', import.meta.url);
  const css = readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
  assert.match(css, /scroll-padding-top:\s*96px/);
  assert.match(css, /prefers-reduced-motion:\s*no-preference\)[^}]*\{[^}]*scroll-behavior:\s*smooth/);
});
```

- [ ] **Step 2: Comprobar que fallan**

Run: `npm run build && node --test tests/hero.test.mjs`
Expected: FAIL en los 3 tests nuevos.

- [ ] **Step 3: `src/data/site.ts`**

En `hero`, agregar `secondaryCta: 'Ver proyectos',` debajo de `cta: 'Hablemos',`. Debajo de `company: …,` agregar:

```ts
  nav: [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Intuyo', href: '#intuyo' },
    { label: 'Contacto', href: '#contacto' },
  ],
```

- [ ] **Step 4: `src/components/Header.astro` completo**

```astro
---
import { Image } from 'astro:assets';
import logo from '../assets/brand/logo-pmartinez.png';
import { site } from '../data/site';
---

<header class="sticky top-0 z-50 bg-cream">
  <div class="mx-auto flex h-20 max-w-[1100px] items-center justify-between px-4 md:px-[38px]">
    <a href="/" aria-label="Inicio">
      <Image src={logo} alt={site.name} height={60} class="h-[60px] w-auto" loading="eager" />
    </a>
    <nav aria-label="Secciones" class="hidden gap-8 font-medium text-navy md:flex">
      {site.nav.map((item) => <a class="hover:text-red" href={item.href}>{item.label}</a>)}
    </nav>
    <a class="btn btn-red" href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">
      {site.hero.cta}
    </a>
  </div>
</header>
```

- [ ] **Step 5: `src/components/Hero.astro`**

Reemplazar el `<a class="btn btn-red" …>{site.hero.cta}</a>` por:

```astro
    <div class="flex flex-wrap gap-4">
      <a class="btn btn-red" href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">
        {site.hero.cta}
      </a>
      <a class="btn btn-outline" href="#proyectos">{site.hero.secondaryCta}</a>
    </div>
```

- [ ] **Step 6: `src/styles/global.css`**

Dentro de `@layer components`, después de `.btn-cream:hover { … }`:

```css
  .btn-outline {
    border: 2px solid var(--color-navy);
    padding: 6px 29px;
    color: var(--color-navy);
  }
  .btn-outline:hover {
    background-color: var(--color-navy);
    color: #fff;
  }
```

Al final del archivo:

```css
@layer base {
  /* El header fijo mide 80px: las anclas dejan aire para no tapar el título de la sección */
  html {
    scroll-padding-top: 96px;
  }
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
}
```

- [ ] **Step 7: Comprobar que pasan**

Run: `npm test && npm run check`
Expected: todos PASS. El test `'hero muestra la bajada y el CTA a WhatsApp'` sigue verde porque el primer `<a>` de `#inicio` es "Hablemos". Check con 0 errors.

Si el test de CSS falla porque el minificador reescribe la media query (por ejemplo `(prefers-reduced-motion:no-preference)` sin espacio), la regex ya tolera la falta de espacios. Si cambia la forma de otro modo, ajustar solo la regex del test, nunca el CSS.

- [ ] **Step 8: Commit**

```bash
git add src/components/Header.astro src/components/Hero.astro src/styles/global.css src/data/site.ts tests/hero.test.mjs
git commit -m "feat: header fijo con anclas y botón Ver proyectos en el hero

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Contacto con WhatsApp principal y descripción opcional en proyectos

**Files:**
- Modify: `src/components/Contact.astro`
- Modify: `src/data/projects.ts`
- Modify: `src/components/ProjectCard.astro`
- Test: `tests/contact.test.mjs`, `tests/projects.test.mjs`

**Interfaces:**
- Produces: `Project.description?: string`.

- [ ] **Step 1: Escribir los tests que fallan**

En `tests/contact.test.mjs`, al final del test existente agregar:

```js
  assert.match(links[0].getAttribute('class'), /\bbtn-red\b/);
  assert.doesNotMatch(links[1].getAttribute('class') ?? '', /\bbtn-red\b/);
```

En `tests/projects.test.mjs`, agregar:

```js
test('sin description, las tarjetas no muestran párrafo extra', () => {
  for (const card of page().querySelectorAll('#proyectos article')) {
    assert.equal(card.querySelector('p'), null);
  }
});
```

- [ ] **Step 2: Comprobar que falla**

Run: `npm run build && node --test tests/contact.test.mjs tests/projects.test.mjs`
Expected: FAIL en contacto (`btn-red`). El test de proyectos ya pasa, porque hoy no hay párrafo. Es un test de regresión para el paso 5.

- [ ] **Step 3: `src/components/Contact.astro`**

En el frontmatter, después de `const items = [...]`, agregar:

```ts
const [primary, ...secondary] = items;
```

Reemplazar el bloque `{ items.map((item) => ( <a class="group mb-5 flex font-medium" …> … </a> )) }` por:

```astro
    <a
      class="btn btn-red mb-6 flex items-center justify-center gap-3"
      href={primary.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={primary.icon} alt="" width="19" height={primary.h} />
      {primary.label}
    </a>
    {
      secondary.map((item) => (
        <a
          class="group mb-5 flex font-medium"
          href={item.href}
          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span class="mr-4 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-navy">
            <img src={item.icon} alt="" width="19" height={item.h} />
          </span>
          <span class="btn btn-cream flex-1 group-hover:bg-aqua">{item.label}</span>
        </a>
      ))
    }
```

- [ ] **Step 4: `src/data/projects.ts`**

En `interface Project`, debajo de `cta: 'Visitar' | 'Explorar';`:

```ts
  /** Una línea sobre el problema y lo que se hizo; opcional, la tarjeta la muestra solo si existe. */
  description?: string;
```

- [ ] **Step 5: `src/components/ProjectCard.astro`**

Envolver el contenido actual del `<article>` en un `<div>` que se queda con las clases de la tarjeta, y agregar el párrafo condicional:

```astro
<article class="flex flex-col">
  <div class="group relative aspect-[1600/1085] overflow-hidden">
    {/* …Image, badge de tecnología y overlay con el link: sin cambios… */}
  </div>
  {project.description && <p class="p-4 text-sm">{project.description}</p>}
</article>
```

El comentario de arriba solo indica dónde va el bloque existente: los tres hijos actuales del `<article>` (`<Image …/>`, el `<div>` del badge y el `<div>` del overlay) se mueven tal cual dentro del nuevo `<div class="group relative aspect-[1600/1085] overflow-hidden">`, sin dejar el comentario.

- [ ] **Step 6: Comprobar que pasan**

Run: `npm test && npm run check`
Expected: todos PASS; 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Contact.astro src/data/projects.ts src/components/ProjectCard.astro tests/contact.test.mjs tests/projects.test.mjs
git commit -m "feat: WhatsApp como contacto principal y descripción opcional de proyectos

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Revisión visual y ajuste de decoración (controlador)

La hace el controlador con el navegador integrado, no un subagente.

**Files:**
- Modify (si hace falta): `src/components/About.astro`, `src/components/Contact.astro` (offsets de los círculos `circles*.svg`)
- Modify: `C:\Users\P Martinez\SecondBrain PM\Personal\Projects\Pamartinez\Web Pamartinez.md` (fila de historial)

- [ ] **Step 1:** `npm run build` y `npm run preview -- --port 4321` (configuración `astro-preview` de `.claude/launch.json`).
- [ ] **Step 2:** A 1280, 790 y 375 px, comprobar con JS que `document.documentElement.scrollWidth <= innerWidth` y que `document.documentElement.scrollHeight` coincide con el borde inferior del footer.
- [ ] **Step 3:** Ver las capturas de cada sección: ningún círculo tapa texto, el header queda fijo al hacer scroll y en móvil muestra solo el logo y "Hablemos".
- [ ] **Step 4:** Navegar a `#servicios`, `#proyectos`, `#intuyo` y `#contacto` y confirmar que el título de cada sección queda visible bajo el header.
- [ ] **Step 5:** Si un círculo queda mal, ajustar su offset o borrarlo. Correr `npm test` y hacer commit `fix(ui): reubicar círculos decorativos tras la reestructura`.
- [ ] **Step 6:** Agregar una fila de historial en la nota del vault con lo implementado, los commits y la evidencia de los tests.
