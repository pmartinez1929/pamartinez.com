# Migración de pamartinez.com a Astro — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir la one-page de pamartinez.com (hoy un build de Gatsby sin código fuente) como proyecto Astro + Tailwind con el mismo diseño y contenido, desplegable en hosting PHP compartido.

**Architecture:** Astro con salida estática. Hay un componente `.astro` por sección y el contenido vive en `src/data/*.ts`. Las imágenes raster pasan por `astro:assets` y los SVG se sirven desde `public/svg/`. Los tests son `node:test` sobre el HTML de `dist/` (se hace build y luego se parsea con `node-html-parser`).

**Tech Stack:** Astro 7.4.5, Tailwind CSS 4.3.4 (`@tailwindcss/vite`), `@astrojs/sitemap` 3.7.4, `@fontsource/vidaloka` y `@fontsource/quicksand` 5.3.0, `@astrojs/check` 0.9.12 + TypeScript ^6, `node-html-parser` 9.0.6, Node ≥ 22.23.4 (local: 24.14).

**Spec:** `docs/superpowers/specs/2026-11-04-astro-migration-design.md`

## Global Constraints

- Contenido idéntico al sitio actual (textos copiados literalmente, incluidas sus erratas originales: "hacerse realizad", "Contactame", "Quien soy"). La actualización de contenido queda fuera de este plan.
- Todo texto editable vive en `src/data/*.ts`. Los componentes no tienen copy hardcodeado, salvo `404.astro`.
- Paleta (`@theme`): `navy #1d3557`, `blue #457b9d`, `aqua #a8dadc`, `cream #f1faee`, `red #e63946`, `ink #1e1e1e`, `muted #b1b1b1`.
- Tipografías: Vidaloka para títulos (`font-display`) y Quicksand 400/500 para el texto (`font-sans`), autoalojadas con `@fontsource`.
- Cero JavaScript en el cliente: no se usan `client:*` ni `<script>`.
- Links externos con `target="_blank" rel="noopener noreferrer"`.
- `astro.config.mjs`: `site: 'https://pamartinez.com'`, `output: 'static'`, `build.format: 'directory'`.
- `<html lang="es">`.
- Commits locales en `main`. **No hacer `git push`** sin aprobación explícita del usuario.
- Windows + Git Bash: usar rutas con comillas (el home tiene un espacio: `C:/Users/P Martinez`).

## Referencias de medidas (sitio actual, desktop 1009px / móvil 375px)

| Elemento | Desktop | Móvil |
| --- | --- | --- |
| Header | `mt-24px h-80px bg-cream`, logo 146×60 centrado | `px-16px` |
| Hero contenedor | `max-w-664px my-100px` | `my-60px px-24px` |
| Hero h1 | 64px Vidaloka bold navy; segunda línea muted, alineada a la derecha, con "&" en caja red 50×55 (Quicksand 45px blanca) | 24px |
| Hero texto | bloque 442px, p `my-35px`, botón red | ancho completo |
| Intuyo | sección h-710px con fondo `cover` fixed; tarjeta `bg-white/90 rounded-18px p-40px max-w-710px` | `p-24px w-90%` |
| Pills | 14px/500 blanco, `px-16 py-4 rounded-20 mb-20`; red (Intuyo) o aqua (Quien soy / He trabajado) | igual |
| About | `max-w-860px py-50px`; grid `110px 1fr 170px gap-16` | 1 columna, `px-24px` |
| Botones | 18px/500, `px-31 py-8 rounded-20`; red (blanco) o cream (navy) | igual |
| Servicios | grid 2 columnas `gap-16 my-64`; cabecera `bg-blue rounded-12 p-14`, ícono 110px circular cream en `-top-11px`, a `-18px` del borde contrario al texto; título 24px blanco + acento 34px aqua (Vidaloka) | 1 columna |
| Clientes | 5 columnas `py-40`, celdas `p-24` | 2 columnas |
| Proyectos | full-bleed, 2 columnas sin gap, aspecto 1600/1085; badge 100×100 `bg-white/90` en la esquina interior; overlay `bg-black/40` opacity 0→1 en hover con botón blanco `rounded-12 px-16 py-4` + ícono link 20px | 2 columnas, badge 48px |
| Contacto | `max-w-420 py-140`; h2 48px navy, "conecta" 64px muted; 3 filas: ícono 44px `bg-navy rounded-16 mr-16` + botón cream | `py-80 px-24`, h2 24px |
| Círculos decorativos | About: `circles-red.svg` (w 671 en left −266/top −154; w 252 en right −60/top 834). Contacto: `circles.svg` (w 454 en left −90/top −201; w 252 en right −60/top 595) | anchos 292 / 168 |
| Footer | `bg-navy text-white text-center p-16` | igual |

---

## File Structure

```
package.json, astro.config.mjs, tsconfig.json
src/
  layouts/BaseLayout.astro       <head> + body, SEO
  pages/index.astro              ensambla secciones
  pages/404.astro
  components/Header.astro Hero.astro Intuyo.astro About.astro Services.astro
             Clients.astro Projects.astro ProjectCard.astro Contact.astro Footer.astro
  data/site.ts                   identidad, SEO, contacto, redes, copy de hero/intuyo/about/contacto
  data/services.ts  data/clients.ts  data/projects.ts
  assets/brand/ assets/clients/ assets/projects/ assets/icons/ assets/tech/ assets/profile.jpg
  styles/global.css
public/
  svg/ (circles, circles-red, intuyo-badge, icon-link, icon-whatsapp, icon-email, icon-calendar)
  icons/icon-*.png  favicon-32x32.png  manifest.webmanifest  robots.txt  .htaccess
tests/
  helpers.mjs  layout.test.mjs  hero.test.mjs  intuyo-about.test.mjs  services-clients.test.mjs
  projects.test.mjs  contact.test.mjs  seo-hosting.test.mjs  deploy.test.mjs  links.test.mjs
.github/workflows/deploy.yml
README.md
```

---

### Task 1: Scaffold Astro + Tailwind, assets, layout base y harness de tests

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/data/site.ts`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `tests/helpers.mjs`, `tests/layout.test.mjs`
- Create (copias): `src/assets/**`, `public/svg/**`, `public/icons/**`, `public/favicon-32x32.png`

**Interfaces:**
- Produces: `site` (export de `src/data/site.ts`) con al menos `site.title`, `site.description`, `site.url`, `site.name`. `BaseLayout` con props `{ title?: string; description?: string }`. Helpers de test `page(path?)`, `distHas(path)` y `t(el)`.

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "pamartinez.com",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "engines": { "node": ">=22.23.4" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "astro build && node --test \"tests/**/*.test.mjs\""
  }
}
```

- [ ] **Step 2: Instalar dependencias**

```bash
cd "/c/Users/P Martinez/htdocs/pamartinez"
npm i astro@7.4.5 @astrojs/sitemap@3.7.4 tailwindcss@4.3.4 @tailwindcss/vite@4.3.4 @fontsource/vidaloka@5.3.0 @fontsource/quicksand@5.3.0
npm i -D @astrojs/check@0.9.12 "typescript@^6" node-html-parser@9.0.6
```
Expected: instalación sin errores `ERESOLVE`. (`@astrojs/check` exige `typescript ^5 || ^6`; no instalar TS 7.)

- [ ] **Step 3: Copiar assets desde `_assets-old/` con nombres finales**

```bash
cd "/c/Users/P Martinez/htdocs/pamartinez"
A=_assets-old
mkdir -p src/assets/{brand,clients,projects,icons,tech} public/svg public/icons
cp $A/icon_pmartinez.png  src/assets/brand/logo-pmartinez.png
cp $A/text_intuyo.png     src/assets/brand/intuyo-wordmark.png
cp $A/back_intuyo.jpg     src/assets/brand/intuyo-background.jpg
cp $A/profile.jpg         src/assets/profile.jpg
cp $A/icon_web.png        src/assets/icons/icon-web.png
cp $A/icon_ux.png         src/assets/icons/icon-ux.png
for t in nuxt vue wordpress figma codeigniter; do cp $A/icon_$t.png src/assets/tech/$t.png; done
for c in 1001 herrera corpomedica maret verde; do cp $A/$c.png src/assets/clients/$c.png; done
cp $A/project1_1001.jpg   src/assets/projects/1001carros.jpg
cp $A/project_oag.jpg     src/assets/projects/oagpro.jpg
cp $A/project3.jpg        src/assets/projects/corpomedica.jpg
cp $A/project4.jpg        src/assets/projects/pethomie.jpg
cp $A/project5_maxus.jpg  src/assets/projects/maxus.jpg
cp $A/project7.jpg        src/assets/projects/valiente.jpg
cp $A/circles.svg         public/svg/circles.svg
cp $A/circles_red.svg     public/svg/circles-red.svg
cp $A/intuyo-badge.svg    public/svg/intuyo-badge.svg
for i in link whatsapp email calendar; do cp $A/icon-$i.svg public/svg/icon-$i.svg; done
cp $A/icons/*.png public/icons/
cp $A/favicon-32x32.png public/favicon-32x32.png
find src/assets public -type f | sort
```
Expected: 25 archivos en `src/assets`, 7 en `public/svg`, 8 en `public/icons` y el favicon.

- [ ] **Step 4: Escribir el harness y el test que falla**

`tests/helpers.mjs`:
```js
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
  return a.getAttribute('target') === '_blank' && /noopener/.test(a.getAttribute('rel') ?? '');
}
```

`tests/layout.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page } from './helpers.mjs';

test('index tiene lang es, viewport y título del sitio', () => {
  const doc = page();
  assert.equal(doc.querySelector('html').getAttribute('lang'), 'es');
  assert.ok(doc.querySelector('meta[name="viewport"]'));
  assert.equal(doc.querySelector('title').text, 'Pablo A Martínez | Frontend Developer y UX Designer');
});

test('index carga la hoja de estilos compilada', () => {
  const doc = page();
  assert.ok(doc.querySelector('link[rel="stylesheet"]') || doc.querySelector('style'));
});
```

- [ ] **Step 5: Correr el test y verificar que falla**

Run: `npm test`
Expected: FAIL. `astro build` falla porque no existe `astro.config.mjs` ni `src/pages`, o el test arroja `ENOENT ... dist/index.html`.

- [ ] **Step 6: Implementar config, estilos, `site.ts`, layout e index mínimo**

`astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://pamartinez.com',
  output: 'static',
  build: { format: 'directory' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "_assets-old"]
}
```

`src/styles/global.css`:
```css
@import "tailwindcss";
@import "@fontsource/vidaloka/400.css";
@import "@fontsource/quicksand/400.css";
@import "@fontsource/quicksand/500.css";

@theme {
  --color-navy: #1d3557;
  --color-blue: #457b9d;
  --color-aqua: #a8dadc;
  --color-cream: #f1faee;
  --color-red: #e63946;
  --color-ink: #1e1e1e;
  --color-muted: #b1b1b1;

  --font-display: "Vidaloka", Georgia, serif;
  --font-sans: "Quicksand", system-ui, sans-serif;
}

@layer base {
  body {
    font-family: var(--font-sans);
    color: var(--color-ink);
    background-color: #fff;
    overflow-x: clip;
  }
  a:focus-visible {
    outline: 2px solid var(--color-navy);
    outline-offset: 3px;
  }
}

@layer components {
  .pill {
    display: inline-block;
    margin-bottom: 20px;
    border-radius: 20px;
    padding: 4px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
  .btn {
    display: inline-block;
    border-radius: 20px;
    padding: 8px 31px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    transition: background-color 0.2s, color 0.2s;
  }
  .btn-red {
    background-color: var(--color-red);
    color: #fff;
  }
  .btn-red:hover {
    background-color: var(--color-navy);
  }
  .btn-cream {
    background-color: var(--color-cream);
    color: var(--color-navy);
  }
  .btn-cream:hover {
    background-color: var(--color-aqua);
  }
}
```

`src/data/site.ts` (versión inicial; las tareas siguientes agregan claves):
```ts
export const site = {
  name: 'Pablo Martínez',
  url: 'https://pamartinez.com',
  title: 'Pablo A Martínez | Frontend Developer y UX Designer',
  description:
    'Ideando productos digitales centrados en los objetivos del usuario. La importancia de un buen diseño parte de una necesidad, analiza, prototipa, ejecuta.',
  twitter: '@pmartinez1929',
};
```

`src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/global.css';
import { site } from '../data/site';

interface Props {
  title?: string;
  description?: string;
}

const { title = site.title, description = site.description } = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <main></main>
</BaseLayout>
```

- [ ] **Step 7: Correr los tests y el type-check**

Run: `npm test`
Expected: PASS, 2 tests.
Run: `npx astro check`
Expected: `0 errors`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src public tests
git commit -m "chore: scaffold Astro + Tailwind con assets y harness de tests"
```

---

### Task 2: Header, Hero y Footer

**Files:**
- Modify: `src/data/site.ts`, `src/pages/index.astro`
- Create: `src/components/Header.astro`, `src/components/Hero.astro`, `src/components/Footer.astro`
- Test: `tests/hero.test.mjs`

**Interfaces:**
- Consumes: `site`, `BaseLayout`.
- Produces: en `site` se agregan `site.contact.{whatsapp,calendly,email}` y `site.hero.{titleLine1,titleLine2,cta}`.

- [ ] **Step 1: Escribir el test que falla** (`tests/hero.test.mjs`)

```js
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
  assert.equal(t(h1s[0]), 'Desarrollador Front-end & diseñador UX');
});

test('hero muestra la bajada y el CTA a WhatsApp', () => {
  const hero = page().querySelector('#inicio');
  assert.match(t(hero), /Ideando productos digitales centrados en los objetivos del usuario\./);
  const cta = hero.querySelector('a');
  assert.equal(t(cta), 'Contáctanos');
  assert.equal(cta.getAttribute('href'), 'https://api.whatsapp.com/send?phone=593995027973');
  assert.ok(isSafeExternal(cta));
});

test('footer muestra nombre y año actual', () => {
  const footer = page().querySelector('footer');
  assert.equal(t(footer), `Pablo Martínez · © ${new Date().getFullYear()}`);
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL en `hero.test.mjs` (`header img` es null).

- [ ] **Step 3: Implementar**

En `src/data/site.ts`, agregar dentro del objeto `site` (después de `twitter`):
```ts
  contact: {
    whatsapp: 'https://api.whatsapp.com/send?phone=593995027973',
    calendly: 'https://calendly.com/pmartinez1929/reunion',
    email: 'pmartinezesp@outlook.com',
  },
  hero: {
    titleLine1: 'Desarrollador Front-end',
    titleLine2: 'diseñador UX',
    cta: 'Contáctanos',
  },
```

`src/components/Header.astro`:
```astro
---
import { Image } from 'astro:assets';
import logo from '../assets/brand/logo-pmartinez.png';
import { site } from '../data/site';
---

<header class="mt-6 flex h-20 items-center justify-center bg-cream px-4 md:px-[38px]">
  <a href="/" aria-label="Inicio">
    <Image src={logo} alt={site.name} height={60} class="h-[60px] w-auto" loading="eager" />
  </a>
</header>
```

`src/components/Hero.astro`:
```astro
---
import { site } from '../data/site';
---

<section id="inicio" class="mx-auto my-[60px] flex max-w-[664px] flex-col items-center px-6 md:my-[100px] md:px-0">
  <h1 class="w-full font-display text-2xl leading-tight font-bold text-navy md:text-[64px] md:leading-none">
    <span class="block">{site.hero.titleLine1}</span>
    <span class="mt-2 flex items-center justify-end gap-3 text-muted">
      <span
        class="flex h-[30px] w-[28px] items-center justify-center bg-red font-sans text-2xl font-normal text-white md:h-[55px] md:w-[50px] md:text-[45px]"
        >&amp;</span
      >
      {site.hero.titleLine2}
    </span>
  </h1>
  <div class="flex w-full flex-col items-start md:w-[442px]">
    <p class="my-[35px] max-w-[680px]">{site.description}</p>
    <a class="btn btn-red" href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">
      {site.hero.cta}
    </a>
  </div>
</section>
```

`src/components/Footer.astro`:
```astro
---
import { site } from '../data/site';
const year = new Date().getFullYear();
---

<footer class="bg-navy p-4 text-center text-white">
  {site.name} &nbsp;·&nbsp; © {year}
</footer>
```
> El test normaliza espacios, pero `&nbsp;` no es `\s` para todas las versiones del parser. Si el test de footer falla solo por eso, reemplazar `&nbsp;·&nbsp;` por ` · ` (espacios normales) y usar `mx-2` en un `<span>` para el separador.

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout>
  <Header />
  <main>
    <Hero />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Correr tests**

Run: `npm test`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "feat: header, hero y footer"
```

---

### Task 3: Sección Intuyo y bloque "Quien soy"

**Files:**
- Modify: `src/data/site.ts`, `src/pages/index.astro`
- Create: `src/components/Intuyo.astro`, `src/components/About.astro`
- Test: `tests/intuyo-about.test.mjs`

**Interfaces:**
- Consumes: `site`.
- Produces: en `site` se agregan `site.intuyo.{label,text}`, `site.about.{label,bioBefore,bioAfter,text}`, `site.company.{name,url}` y `site.socials: { label: string; url: string }[]`. `About.astro` expone un `<slot />` dentro de su contenedor `max-w-[860px]`; Task 4 inyecta ahí Services y Clients.

- [ ] **Step 1: Escribir el test que falla** (`tests/intuyo-about.test.mjs`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('sección Intuyo con pill, logo y texto', () => {
  const s = page().querySelector('#intuyo');
  assert.ok(s);
  assert.match(t(s), /^Entusiasta de/);
  assert.ok(s.querySelector('img[alt="Intuyo"]'));
  assert.match(t(s), /La idea de Intuyo es analizar, idear y mejorar la experiencia de usuarios en entornos digitales\./);
});

test('quien soy: foto, bio con Blubear y texto', () => {
  const s = page().querySelector('#sobre-mi');
  assert.ok(s);
  assert.ok(s.querySelector('h2'));
  assert.equal(t(s.querySelector('h2')), 'Quien soy');
  assert.ok(s.querySelector('img[alt="Foto de Pablo Martínez"]'));
  assert.match(t(s), /Soy Pablo Martínez he trabajado aproximadamente 8 años como desarrollador Front-end para diferentes marcas\. Actualmente me encuentro trabajando para Blubear\.io/);
  const blubear = s.querySelector('a[href="https://blubear.io/"]');
  assert.ok(blubear && isSafeExternal(blubear));
  assert.match(t(s), /Persona curiosa y autodidacta/);
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
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL (`#intuyo` es null).

- [ ] **Step 3: Implementar**

En `src/data/site.ts`, agregar dentro de `site`:
```ts
  company: { name: 'Blubear.io', url: 'https://blubear.io/' },
  intuyo: {
    label: 'Entusiasta de',
    text: 'La idea de Intuyo es analizar, idear y mejorar la experiencia de usuarios en entornos digitales. Permitiendo crear sistemas digitales que cumplan con el objetivo del negocio y que estén orientados a usuarios finales.',
  },
  about: {
    label: 'Quien soy',
    bioBefore:
      'Soy Pablo Martínez he trabajado aproximadamente 8 años como desarrollador Front-end para diferentes marcas. Actualmente me encuentro trabajando para',
    text: 'Persona curiosa y autodidacta que busca ayudar a comprender cuales son las necesidades de una idea, y como esta puede hacerse realizad a través de un producto digital.',
  },
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/pmartinezesp/' },
    { label: 'GitHub', url: 'https://github.com/pmartinez1929' },
    { label: 'Behance', url: 'https://www.behance.net/pablomartinez102' },
    { label: 'Instagram', url: 'https://www.instagram.com/intuyo.dev/' },
  ],
```
> La bio termina con el link de la empresa (`site.company`), por eso solo existe `bioBefore`. No agregar `bioAfter`.

`src/components/Intuyo.astro`:
```astro
---
import { Image, getImage } from 'astro:assets';
import background from '../assets/brand/intuyo-background.jpg';
import wordmark from '../assets/brand/intuyo-wordmark.png';
import { site } from '../data/site';

const bg = await getImage({ src: background, format: 'webp', width: 1600 });
---

<section
  id="intuyo"
  class="flex h-[710px] items-center justify-center bg-cover bg-center md:bg-fixed"
  style={`background-image: url('${bg.src}')`}
>
  <div class="flex w-[90%] max-w-[710px] flex-col items-center rounded-[18px] bg-white/90 p-6 md:p-10">
    <div class="w-full max-w-[320px]">
      <p class="pill bg-red">{site.intuyo.label}</p>
      <img src="/svg/intuyo-badge.svg" alt="Intuyo" width="326" height="158" class="w-full" />
    </div>
    <p class="mt-5 mb-[50px] max-w-[80%] text-center">{site.intuyo.text}</p>
    <Image src={wordmark} alt="" width={303} />
  </div>
</section>
```

`src/components/About.astro`:
```astro
---
import { Image } from 'astro:assets';
import profile from '../assets/profile.jpg';
import { site } from '../data/site';
---

<div class="relative">
  <img
    src="/svg/circles-red.svg"
    alt=""
    aria-hidden="true"
    class="pointer-events-none absolute top-[834px] -right-[60px] hidden w-[252px] md:block"
  />
  <section id="sobre-mi" class="relative mx-auto flex max-w-[860px] flex-col px-6 py-[50px] md:px-0">
    <img
      src="/svg/circles-red.svg"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute -top-[154px] -left-[266px] w-[292px] md:w-[671px]"
    />
    <div class="relative">
      <h2 class="pill bg-aqua">{site.about.label}</h2>
      <div class="grid gap-4 md:grid-cols-[110px_1fr_170px]">
        <Image src={profile} alt="Foto de Pablo Martínez" width={110} height={110} class="size-[110px] rounded-full" />
        <div class="flex flex-col">
          <p class="mb-4 text-lg font-medium">
            {site.about.bioBefore}
            <a class="underline" href={site.company.url} target="_blank" rel="noopener noreferrer">{site.company.name}</a>
          </p>
          <p class="mb-6 max-w-[680px]">{site.about.text}</p>
        </div>
        <div class="flex flex-col gap-2">
          {
            site.socials.map((s) => (
              <a data-social class="btn btn-cream" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))
          }
        </div>
      </div>
      <slot />
    </div>
  </section>
</div>
```

`src/pages/index.astro`: importar `Intuyo` y `About` y dejar el `<main>` así:
```astro
  <main>
    <Hero />
    <Intuyo />
    <About />
  </main>
```

- [ ] **Step 4: Correr tests**

Run: `npm test`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "feat: secciones Intuyo y Quien soy"
```

---

### Task 4: Servicios y "He trabajado" (clientes)

**Files:**
- Create: `src/data/services.ts`, `src/data/clients.ts`, `src/components/Services.astro`, `src/components/Clients.astro`
- Modify: `src/data/site.ts`, `src/pages/index.astro`
- Test: `tests/services-clients.test.mjs`

**Interfaces:**
- Consumes: `About.astro` `<slot />`.
- Produces: `export interface Service { title: string; accent: string; description: string; items: string[]; icon: ImageMetadata; iconSide: 'left' | 'right' }`, `export const services: Service[]`, `export interface Client { name: string; logo: ImageMetadata }`, `export const clients: Client[]`.

- [ ] **Step 1: Escribir el test que falla** (`tests/services-clients.test.mjs`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t } from './helpers.mjs';

test('dos servicios con título, descripción e items', () => {
  const cards = page().querySelectorAll('#servicios article');
  assert.equal(cards.length, 2);
  assert.equal(t(cards[0].querySelector('h3')), 'Desarrollo digital');
  assert.match(t(cards[0]), /He trabajado con varios frameworks Javascript\. \(React, VueJS, Angular\)/);
  assert.deepEqual(cards[0].querySelectorAll('li').map(t), ['Desarrollo web', 'Desarrollo de aplicaciones móviles']);
  assert.equal(t(cards[1].querySelector('h3')), 'Diseño UX');
  assert.match(t(cards[1]), /Utilizo Figma para prototipar y testear\./);
  assert.deepEqual(cards[1].querySelectorAll('li').map(t), [
    'Prototipado y arquitectura',
    'Diseño UI y diseño de interacción',
    'Investigación y testeo',
  ]);
});

test('he trabajado: pill y 5 logos con alt', () => {
  const s = page().querySelector('#clientes');
  assert.equal(t(s.querySelector('h2')), 'He trabajado');
  const alts = s.querySelectorAll('img').map((i) => i.getAttribute('alt'));
  assert.deepEqual(alts, ['1001 Carros', 'Herrera', 'Corpo Médica', 'Maret', 'Verde']);
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL (`#servicios article` tiene longitud 0).

- [ ] **Step 3: Implementar**

`src/data/services.ts`:
```ts
import type { ImageMetadata } from 'astro';
import iconWeb from '../assets/icons/icon-web.png';
import iconUx from '../assets/icons/icon-ux.png';

export interface Service {
  title: string;
  accent: string;
  description: string;
  items: string[];
  icon: ImageMetadata;
  /** Lado donde va el ícono; el texto de la cabecera se alinea al lado opuesto. */
  iconSide: 'left' | 'right';
}

export const services: Service[] = [
  {
    title: 'Desarrollo',
    accent: 'digital',
    description: 'He trabajado con varios frameworks Javascript. (React, VueJS, Angular)',
    items: ['Desarrollo web', 'Desarrollo de aplicaciones móviles'],
    icon: iconWeb,
    iconSide: 'left',
  },
  {
    title: 'Diseño',
    accent: 'UX',
    description: 'Utilizo Figma para prototipar y testear.',
    items: ['Prototipado y arquitectura', 'Diseño UI y diseño de interacción', 'Investigación y testeo'],
    icon: iconUx,
    iconSide: 'right',
  },
];
```

`src/data/clients.ts`:
```ts
import type { ImageMetadata } from 'astro';
import carros from '../assets/clients/1001.png';
import herrera from '../assets/clients/herrera.png';
import corpomedica from '../assets/clients/corpomedica.png';
import maret from '../assets/clients/maret.png';
import verde from '../assets/clients/verde.png';

export interface Client {
  name: string;
  logo: ImageMetadata;
}

export const clients: Client[] = [
  { name: '1001 Carros', logo: carros },
  { name: 'Herrera', logo: herrera },
  { name: 'Corpo Médica', logo: corpomedica },
  { name: 'Maret', logo: maret },
  { name: 'Verde', logo: verde },
];
```

`src/components/Services.astro`:
```astro
---
import { Image } from 'astro:assets';
import { services } from '../data/services';
---

<section id="servicios" class="my-16 grid gap-16 md:grid-cols-2 md:gap-4">
  {
    services.map((s) => (
      <article class="flex flex-col">
        <div
          class:list={[
            'relative mb-4 rounded-xl bg-blue p-[14px]',
            s.iconSide === 'left' ? 'pl-[110px] text-right' : 'pr-[110px] text-left',
          ]}
        >
          <div
            class:list={[
              'absolute -top-[11px] flex size-[110px] items-center justify-center rounded-full bg-cream',
              s.iconSide === 'left' ? '-left-[18px]' : '-right-[18px]',
            ]}
          >
            <Image src={s.icon} alt="" />
          </div>
          <h3 class="font-display font-bold">
            <span class="block text-2xl leading-none text-white">{s.title}</span>
            <span class="block text-[34px] leading-none text-aqua">{s.accent}</span>
          </h3>
        </div>
        <p class="mb-4 text-lg font-medium">{s.description}</p>
        <ul>
          {s.items.map((item) => <li class="mb-1">{item}</li>)}
        </ul>
      </article>
    ))
  }
</section>
```
> El `h3` tiene dos `<span>` en bloque. `t()` produce "Desarrollo digital" porque el salto de línea entre spans colapsa a un espacio. Si el parser los junta sin espacio, agregar `{' '}` entre ambos spans.

En `src/data/site.ts`, agregar dentro de `site`:
```ts
  clientsLabel: 'He trabajado',
```

`src/components/Clients.astro`:
```astro
---
import { Image } from 'astro:assets';
import { clients } from '../data/clients';
import { site } from '../data/site';
---

<section id="clientes">
  <div class="flex justify-center">
    <h2 class="pill bg-aqua">{site.clientsLabel}</h2>
  </div>
  <div class="grid grid-cols-2 py-10 md:grid-cols-5">
    {
      clients.map((c) => (
        <div class="flex items-center justify-center p-6">
          <Image src={c.logo} alt={c.name} />
        </div>
      ))
    }
  </div>
</section>
```
`src/pages/index.astro`: importar `Services` y `Clients` y cambiar `<About />` por:
```astro
    <About>
      <Services />
      <Clients />
    </About>
```

- [ ] **Step 4: Correr tests**

Run: `npm test`
Expected: PASS (11 tests).

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "feat: servicios y logos de clientes"
```

---

### Task 5: Proyectos

**Files:**
- Create: `src/data/projects.ts`, `src/components/ProjectCard.astro`, `src/components/Projects.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/projects.test.mjs`

**Interfaces:**
- Produces: `export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`, `export interface Project { name: string; url: string; image: ImageMetadata; tech: { name: string; icon: ImageMetadata }; cta: 'Visitar' | 'Explorar'; corner: Corner }` y `export const projects: Project[]`. `ProjectCard` recibe `{ project: Project }`.

- [ ] **Step 1: Escribir el test que falla** (`tests/projects.test.mjs`)

```js
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
```
> `getAttribute('href')` devuelve el valor crudo. Si Astro escapa `&` como `&amp;` y el parser no lo decodifica, comparar contra `url.replaceAll('&', '&amp;')` o decodificar con `he`/reemplazo manual. Verificarlo en el primer run.

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL (`#proyectos article` tiene longitud 0).

- [ ] **Step 3: Implementar**

`src/data/projects.ts`:
```ts
import type { ImageMetadata } from 'astro';
import carros from '../assets/projects/1001carros.jpg';
import oag from '../assets/projects/oagpro.jpg';
import corpomedica from '../assets/projects/corpomedica.jpg';
import pethomie from '../assets/projects/pethomie.jpg';
import maxus from '../assets/projects/maxus.jpg';
import valiente from '../assets/projects/valiente.jpg';
import nuxt from '../assets/tech/nuxt.png';
import vue from '../assets/tech/vue.png';
import wordpress from '../assets/tech/wordpress.png';
import figma from '../assets/tech/figma.png';
import codeigniter from '../assets/tech/codeigniter.png';

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface Project {
  name: string;
  url: string;
  image: ImageMetadata;
  tech: { name: string; icon: ImageMetadata };
  cta: 'Visitar' | 'Explorar';
  /** Esquina de la tarjeta donde va el badge de tecnología (apunta al centro de la grilla). */
  corner: Corner;
}

const tech = {
  nuxt: { name: 'Nuxt', icon: nuxt },
  vue: { name: 'Vue', icon: vue },
  wordpress: { name: 'WordPress', icon: wordpress },
  figma: { name: 'Figma', icon: figma },
  codeigniter: { name: 'CodeIgniter', icon: codeigniter },
};

export const projects: Project[] = [
  { name: '1001 Carros', url: 'https://1001carros.com/', image: carros, tech: tech.nuxt, cta: 'Visitar', corner: 'bottom-right' },
  { name: 'OAG Pro', url: 'https://www.oagpro.com/', image: oag, tech: tech.vue, cta: 'Visitar', corner: 'bottom-left' },
  { name: 'Corpo Médica', url: 'https://corpo-medica.com/', image: corpomedica, tech: tech.wordpress, cta: 'Visitar', corner: 'top-right' },
  {
    name: 'PetHomie',
    url: 'https://www.figma.com/file/rsOXMJBZT28xMy6sdQzJcG/PetHomie?node-id=11%3A298&t=gMvQ7C8RGV3iCeEp-1',
    image: pethomie,
    tech: tech.figma,
    cta: 'Explorar',
    corner: 'top-left',
  },
  { name: 'Maxus Ecuador', url: 'https://www.maxusecuador.com/', image: maxus, tech: tech.nuxt, cta: 'Visitar', corner: 'bottom-right' },
  { name: 'Valiente', url: 'https://valiente.pamartinez.com/', image: valiente, tech: tech.codeigniter, cta: 'Visitar', corner: 'bottom-left' },
];
```

`src/components/ProjectCard.astro`:
```astro
---
import { Image } from 'astro:assets';
import type { Corner, Project } from '../data/projects';

interface Props {
  project: Project;
}

const { project } = Astro.props;

const cornerClass: Record<Corner, string> = {
  'top-left': 'top-0 left-0 rounded-br-xl',
  'top-right': 'top-0 right-0 rounded-bl-xl',
  'bottom-left': 'bottom-0 left-0 rounded-tr-xl',
  'bottom-right': 'bottom-0 right-0 rounded-tl-xl',
};
---

<article class="group relative aspect-[1600/1085] overflow-hidden">
  <Image
    src={project.image}
    alt={`Captura de ${project.name}`}
    widths={[400, 800, 1200]}
    sizes="(min-width: 768px) 50vw, 50vw"
    class="size-full object-cover"
  />
  <div class:list={['absolute flex size-12 items-center justify-center bg-white/90 md:size-[100px]', cornerClass[project.corner]]}>
    <Image src={project.tech.icon} alt={project.tech.name} width={60} class="h-auto w-6 md:w-[60px]" />
  </div>
  <div
    class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
  >
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.cta} ${project.name}`}
      class="flex items-center rounded-xl bg-white px-4 py-1 font-medium text-black"
    >
      <img src="/svg/icon-link.svg" alt="" width="20" height="20" class="mr-4" />
      {project.cta}
    </a>
  </div>
</article>
```

`src/components/Projects.astro`:
```astro
---
import ProjectCard from './ProjectCard.astro';
import { projects } from '../data/projects';
---

<section id="proyectos" aria-label="Proyectos" class="grid grid-cols-2">
  {projects.map((project) => <ProjectCard project={project} />)}
</section>
```

`src/pages/index.astro`: importar `Projects` y agregar `<Projects />` después de `</About>`.

- [ ] **Step 4: Correr tests**

Run: `npm test`
Expected: PASS (12 tests).

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "feat: grilla de proyectos"
```

---

### Task 6: Contacto

**Files:**
- Modify: `src/data/site.ts`, `src/pages/index.astro`
- Create: `src/components/Contact.astro`
- Test: `tests/contact.test.mjs`

**Interfaces:**
- Consumes: `site.contact`.
- Produces: `site.cta.{title,accent,text,whatsapp,calendly,email}` (los textos de los tres botones).

- [ ] **Step 1: Escribir el test que falla** (`tests/contact.test.mjs`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, t, isSafeExternal } from './helpers.mjs';

test('contacto: título, texto y 3 vías', () => {
  const s = page().querySelector('#contacto');
  assert.equal(t(s.querySelector('h2')), '¿Tienes una idea?');
  assert.match(t(s), /conecta/);
  assert.match(t(s), /Conversemos como una idea se puede convertir en una solución digital y como poder llegar a lograrlo\./);
  const links = s.querySelectorAll('a');
  assert.deepEqual(
    links.map((a) => [t(a), a.getAttribute('href')]),
    [
      ['Contactame al Whatsapp', 'https://api.whatsapp.com/send?phone=593995027973'],
      ['Agenda una reunión (gratuita)', 'https://calendly.com/pmartinez1929/reunion'],
      ['Escribe un correo electrónico', 'mailto:pmartinezesp@outlook.com'],
    ],
  );
  assert.ok(isSafeExternal(links[0]) && isSafeExternal(links[1]));
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL (`#contacto` es null).

- [ ] **Step 3: Implementar**

En `src/data/site.ts`, agregar dentro de `site`:
```ts
  cta: {
    title: '¿Tienes una idea?',
    accent: 'conecta',
    text: 'Conversemos como una idea se puede convertir en una solución digital y como poder llegar a lograrlo.',
    whatsapp: 'Contactame al Whatsapp',
    calendly: 'Agenda una reunión (gratuita)',
    email: 'Escribe un correo electrónico',
  },
```

`src/components/Contact.astro`:
```astro
---
import { site } from '../data/site';

const items = [
  { label: site.cta.whatsapp, href: site.contact.whatsapp, icon: '/svg/icon-whatsapp.svg', h: 19, external: true },
  { label: site.cta.calendly, href: site.contact.calendly, icon: '/svg/icon-calendar.svg', h: 19, external: true },
  { label: site.cta.email, href: `mailto:${site.contact.email}`, icon: '/svg/icon-email.svg', h: 15, external: false },
];
---

<div class="relative">
  <img
    src="/svg/circles.svg"
    alt=""
    aria-hidden="true"
    class="pointer-events-none absolute -top-[201px] -left-[90px] w-[169px] md:w-[454px]"
  />
  <img
    src="/svg/circles.svg"
    alt=""
    aria-hidden="true"
    class="pointer-events-none absolute top-[595px] -right-[60px] hidden w-[252px] md:block"
  />
  <section id="contacto" class="relative mx-auto flex max-w-[420px] flex-col px-6 py-20 text-center md:px-0 md:py-[140px]">
    <h2 class="font-display text-2xl font-bold text-navy md:text-5xl">{site.cta.title}</h2>
    <p class="mb-4 font-display text-[40px] leading-none font-bold text-muted md:text-[64px]" aria-hidden="true">
      {site.cta.accent}
    </p>
    <p class="mb-6">{site.cta.text}</p>
    {
      items.map((item) => (
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
  </section>
</div>
```
> El test exige `/conecta/` en el texto. `aria-hidden` no afecta a `t()`, pero sí oculta la palabra decorativa a lectores de pantalla, que es lo deseado.

`src/pages/index.astro`: importar `Contact` y agregar `<Contact />` después de `<Projects />`.

- [ ] **Step 4: Correr tests**

Run: `npm test`
Expected: PASS (13 tests).

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "feat: sección de contacto"
```

---

### Task 7: SEO, 404, manifest, robots y `.htaccess`

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Create: `src/pages/404.astro`, `public/manifest.webmanifest`, `public/robots.txt`, `public/.htaccess`
- Test: `tests/seo-hosting.test.mjs`

**Interfaces:**
- Consumes: `site.url`, `site.title`, `site.description`, `site.twitter`.

- [ ] **Step 1: Escribir el test que falla** (`tests/seo-hosting.test.mjs`)

```js
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
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL (no hay canonical ni `404.html`).

- [ ] **Step 3: Implementar**

`src/layouts/BaseLayout.astro` (reemplazo completo):
```astro
---
import '../styles/global.css';
import { site } from '../data/site';

interface Props {
  title?: string;
  description?: string;
  noindex?: boolean;
}

const { title = site.title, description = site.description, noindex = false } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
const ogImage = new URL('/icons/icon-512x512.png', Astro.site).href;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {noindex && <meta name="robots" content="noindex" />}
    <link rel="canonical" href={canonical} />
    <meta name="theme-color" content="#1d3557" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="sitemap" href="/sitemap-index.xml" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_EC" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content={site.twitter} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/pages/404.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout title="Página no encontrada | Pablo A Martínez" noindex>
  <Header />
  <main class="mx-auto flex min-h-[60vh] max-w-[664px] flex-col items-center justify-center px-6 text-center">
    <h1 class="font-display text-5xl font-bold text-navy">404</h1>
    <p class="my-6">La página que buscas no existe.</p>
    <a class="btn btn-red" href="/">Volver al inicio</a>
  </main>
  <Footer />
</BaseLayout>
```

`public/manifest.webmanifest`:
```json
{
  "name": "Pablo A Martínez",
  "short_name": "pamartinez",
  "description": "Desarrollador Front-end y diseñador UX",
  "start_url": "/",
  "display": "minimal-ui",
  "background_color": "#ffffff",
  "theme_color": "#1d3557",
  "lang": "es",
  "icons": [
    { "src": "/icons/icon-48x48.png", "sizes": "48x48", "type": "image/png" },
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-256x256.png", "sizes": "256x256", "type": "image/png" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://pamartinez.com/sitemap-index.xml
```

`public/.htaccess`:
```apache
# pamartinez.com — Astro estático en hosting compartido (Apache)

Options -Indexes
DirectoryIndex index.html

# HTTPS obligatorio
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteRule .* https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

ErrorDocument 404 /404.html

# Compresión
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json application/xml image/svg+xml application/manifest+json
</IfModule>

AddType application/manifest+json .webmanifest
AddType image/avif .avif
AddType image/webp .webp

# Cache
<IfModule mod_headers.c>
  # Assets con hash generados por Astro
  <If "%{REQUEST_URI} =~ m#^/_astro/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
  <FilesMatch "\.(html|xml|txt|webmanifest)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  <FilesMatch "\.(png|jpg|jpeg|svg|ico)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# No exponer el estado de FTP-Deploy-Action
<Files ".ftp-deploy-sync-state.json">
  Require all denied
</Files>
```
> Astro copia `public/` completo a `dist/`, dotfiles incluidos. Si `.htaccess` no aparece en `dist/`, el test lo detecta. En ese caso, agregar un pequeño script `postbuild` en `package.json`: `"build": "astro build && node -e \"require('fs').copyFileSync('public/.htaccess','dist/.htaccess')\""`, y ajustar `test` para que use `npm run build`.

- [ ] **Step 4: Correr tests y type-check**

Run: `npm test`
Expected: PASS (16 tests).
Run: `npx astro check`
Expected: `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add src public tests package.json
git commit -m "feat: SEO, 404, manifest, robots y .htaccess para hosting compartido"
```

---

### Task 8: Workflow de deploy por FTP y README

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`
- Test: `tests/deploy.test.mjs`

- [ ] **Step 1: Escribir el test que falla** (`tests/deploy.test.mjs`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const wf = () => readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');

test('workflow despliega dist/ por FTP solo si hay secrets', () => {
  const y = wf();
  assert.match(y, /branches: \[main\]/);
  assert.match(y, /workflow_dispatch/);
  assert.match(y, /npm ci/);
  assert.match(y, /npm test/);
  assert.match(y, /SamKirkland\/FTP-Deploy-Action@v4\.3\.5/);
  assert.match(y, /local-dir: \.\/dist\//);
  assert.match(y, /if: \$\{\{ env\.FTP_SERVER != '' \}\}/);
  for (const s of ['FTP_SERVER', 'FTP_USERNAME', 'FTP_PASSWORD', 'FTP_DIR']) assert.match(y, new RegExp(`secrets\\.${s}`));
});

test('README documenta deploy manual y automático', () => {
  const r = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  assert.match(r, /npm run build/);
  assert.match(r, /FTP_SERVER/);
  assert.match(r, /src\/data/);
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL `ENOENT ... deploy.yml`.

- [ ] **Step 3: Implementar**

`.github/workflows/deploy.yml`:
```yaml
name: Build y deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-production
  cancel-in-progress: false

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    env:
      FTP_SERVER: ${{ secrets.FTP_SERVER }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - run: npm ci

      # Compila y valida (astro build + tests sobre dist/)
      - run: npm test

      - name: Deploy por FTP
        if: ${{ env.FTP_SERVER != '' }}
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          server-dir: ${{ secrets.FTP_DIR }}
          protocol: ${{ vars.FTP_PROTOCOL || 'ftps' }}
          port: ${{ vars.FTP_PORT || 21 }}
          local-dir: ./dist/

      - name: Deploy omitido
        if: ${{ env.FTP_SERVER == '' }}
        run: echo "::notice::FTP_SERVER no está configurado; se compiló y validó, pero no se desplegó."
```

`README.md`:
````markdown
# pamartinez.com

Web personal de Pablo A Martínez, construida con [Astro](https://astro.build) + Tailwind CSS. Genera HTML estático para el hosting compartido.

## Requisitos

- Node ≥ 22.23.4 (recomendado 24)

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:4321
npm test          # build + tests sobre dist/
npm run check     # type-check
```

## Editar contenido

Todo el contenido está en `src/data/`:

| Archivo | Contenido |
| --- | --- |
| `site.ts` | Nombre, SEO, contacto, redes y textos de hero, Intuyo, "Quien soy" y contacto |
| `services.ts` | Servicios (Desarrollo digital, Diseño UX) |
| `clients.ts` | Logos de "He trabajado" |
| `projects.ts` | Proyectos (captura, URL, tecnología, CTA) |

Las imágenes van en `src/assets/` (Astro las optimiza) y los SVG decorativos en `public/svg/`.

## Deploy

### Manual

```bash
npm run build
```

Sube **el contenido** de `dist/` (incluido `.htaccess`, que es un archivo oculto) a `public_html` por FTP o el administrador de archivos de cPanel. Antes del primer deploy, respalda el `public_html` actual.

### Automático (GitHub Actions)

`.github/workflows/deploy.yml` compila, ejecuta los tests y sube `dist/` por FTP en cada push a `main`, o manualmente desde la pestaña Actions.

Configura en **Settings → Secrets and variables → Actions**:

| Tipo | Nombre | Ejemplo |
| --- | --- | --- |
| Secret | `FTP_SERVER` | `ftp.pamartinez.com` |
| Secret | `FTP_USERNAME` | usuario FTP |
| Secret | `FTP_PASSWORD` | contraseña FTP |
| Secret | `FTP_DIR` | `/public_html/` (debe terminar en `/`) |
| Variable (opcional) | `FTP_PROTOCOL` | `ftps` (por defecto), `ftp` o `ftps-legacy` |
| Variable (opcional) | `FTP_PORT` | `21` |

Si `FTP_SERVER` no existe, el workflow compila y valida pero no despliega.
````

- [ ] **Step 4: Correr tests**

Run: `npm test`
Expected: PASS (18 tests).

- [ ] **Step 5: Commit**

```bash
git add .github README.md tests
git commit -m "ci: workflow de deploy por FTP y README"
```

---

### Task 9: Paridad de links, verificación visual y cierre en el vault

**Files:**
- Create: `tests/links.test.mjs`
- Modify (vault): `C:/Users/P Martinez/SecondBrain PM/Personal/Projects/Pamartinez/Web Pamartinez.md`

- [ ] **Step 1: Escribir el test de paridad de links**

`tests/links.test.mjs`:
```js
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
```

- [ ] **Step 2: Correr tests**

Run: `npm test`
Expected: PASS (19 tests). Este test valida las tareas anteriores, así que no se espera rojo. Si falla, la tarea que dejó fuera el link tiene un bug: corregirla ahí.

- [ ] **Step 3: Verificación visual contra el sitio actual**

Run (en background): `npm run preview` → `http://localhost:4321`

En el navegador integrado, abrir `http://localhost:4321/` y `https://pamartinez.com/` y comparar, tanto en desktop como en móvil (375×812):
- Orden de las secciones y textos.
- Colores, tipografías y tamaños según la tabla "Referencias de medidas".
- Círculos decorativos sin scroll horizontal (`document.documentElement.scrollWidth === innerWidth`).
- Hover y foco de las tarjetas de proyecto (overlay y botón).
- Fondo de Intuyo.

Corregir diferencias visibles en el componente correspondiente. Por cada ajuste, re-ejecutar `npm test` y commitear con `fix(ui): ...`.

- [ ] **Step 4: Chequeo final**

Run: `npx astro check && npm test`
Expected: `0 errors` y todos los tests en PASS.
Run: `ls -a dist` → contiene `index.html 404.html .htaccess robots.txt sitemap-index.xml manifest.webmanifest _astro svg icons`.

- [ ] **Step 5: Actualizar la Feature en el vault**

En `Web Pamartinez.md`:
- Marcar `[x]` en cada tarea del "Checklist y evidencia" que tenga evidencia observada: nombres de los tests en verde, hashes de commit y la verificación visual.
- Cambiar `feature_status` a `En revisión` (no a `Producción`, porque el deploy no está hecho).
- Actualizar `updated`.
- Agregar una fila en Historial.

- [ ] **Step 6: Commit**

```bash
git add tests
git commit -m "test: paridad de links con el sitio original"
```

> **No ejecutar `git push`.** El push a GitHub dispara el workflow de deploy (si hay secrets), así que requiere la aprobación explícita del usuario.
