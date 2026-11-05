# Mejoras de diseño visual de pamartinez.com — Diseño

- **Fecha:** 2026-11-05
- **Rama:** `feat/diseno` (parte de `feat/estructura`, que aún no está en `main`)
- **Estado:** aprobado en chat por Pablo. Elegido con maquetas en el compañero visual: títulos A, botones A, Cómo trabajo C, Proyectos A, Intuyo A.
- **Spec previa:** `docs/superpowers/specs/2026-11-05-estructura-design.md` (orden de secciones e ids, que no cambian)

## 1. Problema

Feedback de Pablo sobre la versión reestructurada:

- El botón "Ver proyectos" (contorno) no se distingue, y no tiene el mismo ancho que "Hablemos".
- Los títulos de sección son pastillas aqua chicas y centradas, sin peso.
- "Cómo trabajo" se ve mal: números sueltos sin estructura.
- En Proyectos e Intuyo, las imágenes de fondo vuelven confusa la sección: no se entiende qué es cada cosa.

## 2. Títulos de sección (`SectionHeading`)

Hay un componente nuevo, `src/components/SectionHeading.astro`.

- Props: `eyebrow: string`, `title: string`, `tone?: 'light' | 'dark'` (por defecto `'light'`).
- Markup: `<div>` con `<p>` (etiqueta) y `<h2>` (título).
  - **Etiqueta:** `text-xs font-bold uppercase tracking-[0.14em]`, en `text-red`. En `tone="dark"` va en `text-aqua`.
  - **Título:** `font-display text-3xl leading-tight md:text-[44px]`, en `text-navy`. En `tone="dark"` va en `text-white`. Separado de la etiqueta con `mt-1.5`.
  - Alineado a la izquierda.

Uso por sección (los textos van en `src/data/site.ts`):

| Sección | `eyebrow` | `title` (h2) |
|---|---|---|
| `#clientes` | Clientes | He trabajado con |
| `#servicios` | Servicios | Qué hago |
| `#proceso` | Proceso | Cómo trabajo |
| `#proyectos` | Portafolio | Proyectos |
| `#intuyo` | Estoy creando | Intuyo |
| `#sobre-mi` | Sobre mí | Quién soy |

- `#proyectos` deja de tener el h2 `sr-only` y pasa a tener título visible.
- `#contacto` mantiene su encabezado actual ("¿Tienes una idea?" / "conecta").
- La clase `.pill` de `global.css` se elimina, porque queda sin uso.

Estructura de datos en `site.ts`: cada sección expone `{ eyebrow, title }`.
- `site.sections.clients`, `site.sections.services`, `site.sections.process`, `site.sections.projects`, `site.sections.intuyo`, `site.sections.about`.
- Reemplazan a `clientsLabel`, `servicesLabel`, `processLabel`, `projectsLabel`, `intuyo.label` y `about.label`, que se eliminan.

## 3. Botones del hero

- "Hablemos" (`btn btn-red`) y "Ver proyectos →" (`btn btn-navy`) van en una fila con `gap-4`.
  - En móvil (< `sm`) los dos ocupan el ancho completo y se apilan.
  - Desde `sm`, cada uno tiene `min-w-[190px]`, así que miden lo mismo.
- Clase nueva `.btn-navy`: fondo navy y texto blanco. En hover, fondo `blue`.
- Se elimina `.btn-outline`.
- `site.hero.secondaryCta` pasa a `'Ver proyectos →'`.

## 4. Cómo trabajo (opción C)

- Contenedor `max-w-[1000px]`. En desktop es una grilla de 2 columnas: `md:grid-cols-[1fr_1.6fr]` con `gap-10`.
  - **Columna izquierda:** `SectionHeading` (Proceso / Cómo trabajo) y un `<p>` con `site.processIntro = 'Un proceso simple en 4 pasos, de la idea al producto publicado.'`.
  - **Columna derecha:** `<ol>` con los 4 pasos de `steps`. Cada `<li>` es `flex gap-5 py-5`, con `border-b border-black/10` salvo el último.
    - Número (`01`…`04`): `font-display text-3xl text-red leading-none`, `aria-hidden="true"`.
    - `h3`: `font-display text-xl text-navy`.
    - `p` con el texto.
- En móvil, una sola columna.

## 5. Proyectos (opción A)

- `#proyectos` lleva el contenedor `max-w-[1100px] px-6`, el `SectionHeading` y una grilla `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- `ProjectCard` es un `<article>` con `rounded-2xl border border-black/10 overflow-hidden bg-white`. Al pasar el mouse sube 2px (`hover:-translate-y-0.5`) y gana sombra, con transición.
  - **Captura:** `astro:assets` `Image`, `aspect-[16/10] object-cover object-top w-full`, con `alt="Captura de {name}"`.
  - **Cuerpo** (`p-5`):
    - tecnología `text-xs font-bold uppercase tracking-wide text-blue` con el texto `{tech.name}`;
    - nombre en `h3` `font-display text-xl text-navy`;
    - `description` opcional en `<p>` si existe;
    - link de CTA en `font-bold text-red`.
  - **CTA:** "Visitar sitio →" si `cta === 'Visitar'` y "Ver prototipo →" si `cta === 'Explorar'`. La etiqueta sale de un mapa en el componente.
  - **Link:** un solo `<a>` por tarjeta, en el CTA, con `aria-label="{Visitar sitio|Ver prototipo} de {name}"` (incluye el texto visible, WCAG 2.5.3), `target="_blank" rel="noopener noreferrer"` y la clase `after:absolute after:inset-0` (patrón stretched link). Así toda la tarjeta es clicable sin anidar links. El `<article>` lleva `relative`.
  - Ya no se muestra el ícono de tecnología como imagen. `tech.icon` queda en los datos sin uso.
- Se elimina el campo `corner` y el tipo `Corner` de `projects.ts`, junto con el badge de esquina y el overlay negro de hover.

## 6. Intuyo (opción A)

- La sección `#intuyo` es una banda `bg-navy text-white`, sin `background-image`. Ya no importa `intuyo-background.jpg` ni `intuyo-wordmark.png`; los archivos quedan en el repo.
- Contenedor `max-w-[1100px] px-6 py-20`. En desktop es una grilla `md:grid-cols-[1.2fr_1fr]` con `gap-12 items-center`.
  - **Columna de texto:**
    - `SectionHeading` con `tone="dark"` (Estoy creando / Intuyo);
    - `<p>` con `site.intuyo.text` en `text-white/90`;
    - `<p>` con `site.intuyo.status` en `text-sm text-aqua`;
    - botón `btn btn-red` a `site.intuyo.instagram`, con `target="_blank" rel="noopener noreferrer"` y el texto `site.intuyo.ctaLabel`.
  - **Columna del logo:** tarjeta `bg-white rounded-2xl p-8 flex items-center justify-center` con `<img src="/svg/intuyo-badge.svg" alt="Intuyo">` a `max-w-[280px] w-full`.
- En móvil va en una columna, con el logo **arriba** (`order-first md:order-none`).

## 7. Resto de secciones

- **Clientes, Servicios y Quién soy:** reemplazan la pastilla por `SectionHeading` y no cambian nada más.
- **About:** se quita el círculo decorativo `-top-[154px] -left-[266px]` solo si queda detrás del título nuevo y lo ensucia. Se decide en la revisión visual.
- **Contacto, Header y Footer:** sin cambios.

## 8. Accesibilidad

- Un `h2` por sección, todos visibles.
- Contraste de la tecnología en `text-blue` (#457b9d) sobre blanco: 4.6:1, cumple AA.
- Etiqueta roja (#e63946) sobre blanco en texto pequeño en negrita: ~3.9:1, no llega a AA para texto chico. Se acepta como texto decorativo complementario, porque el h2 lleva la información. Queda anotado como riesgo junto al resto del contraste pendiente.
- En la banda navy, el aqua y el blanco tienen contraste alto.
- Tarjetas de proyecto: un solo link con nombre accesible y foco visible (outline global). El `after:inset-0` no tapa el foco.

## 9. Tests (`node:test` sobre `dist/`)

- **Títulos:** para cada id de la tabla de §2, la sección contiene un `h2` con el `title` exacto y, antes del `h2`, un `p` con el `eyebrow` exacto. No queda ningún elemento con clase `pill`.
- **Proyectos:** el h2 "Proyectos" ya no tiene la clase `sr-only`.
- **Hero:**
  - el segundo link de `#inicio` tiene `btn-navy`, `href="#proyectos"` y el texto "Ver proyectos →";
  - ningún elemento usa `btn-outline`.
- **Proceso:** `#proceso` contiene el texto de `processIntro`. Siguen los 4 `ol > li` con sus `h3`.
- **Proyectos:**
  - 6 `article`, cada uno con `h3` = nombre y la tecnología en texto;
  - exactamente 1 `a` por tarjeta, con el href del proyecto, `isSafeExternal` y `aria-label` = "Visitar sitio de {name}" o, en PetHomie, "Ver prototipo de {name}";
  - el texto del CTA es "Visitar sitio →" o, en PetHomie, "Ver prototipo →";
  - `img[alt="Captura de {name}"]`.
- **Intuyo:**
  - `#intuyo` no tiene atributo `style` con `background-image`;
  - tiene `img[alt="Intuyo"]` y el CTA de Instagram seguro;
  - mantiene el texto de estado.
- **`links.test.mjs`:** sin cambios.
- **Revisión visual** a 360, 790 y 1280 px:
  - sin scroll horizontal y la página termina en el footer;
  - los títulos se alinean con el contenido de cada sección;
  - las tarjetas de proyecto quedan de la misma altura dentro de cada fila.

## 10. Fuera de alcance

- Cambios de copy fuera de las etiquetas y la frase de proceso.
- Testimonios y casos de estudio.
- Contraste AA de los demás elementos.
- Rediseño de Contacto, Header y Footer.
- Animaciones.
