# Reestructura de pamartinez.com — Diseño

- **Fecha:** 2026-11-05
- **Rama:** `feat/estructura` (parte de `content/copy`, que aún no está en `main`)
- **Estado:** aprobado en chat por Pablo (estructura, menú opción A, partes 1 y 2 del diseño)
- **Vault:** `Personal/Projects/Pamartinez/Web Pamartinez.md`

## 1. Objetivo

Reordenar la one-page para contar primero qué hace Pablo y mostrar pruebas, y después quién es. Que contactar sea posible desde cualquier punto de la página. **Intuyo se mantiene**: baja de posición y gana un CTA.

## 2. Orden de secciones

`index.astro`, de arriba a abajo:

| # | Sección | `id` | Componente |
|---|---|---|---|
| 1 | Header (sticky) | — | `Header.astro` |
| 2 | Hero | `inicio` | `Hero.astro` |
| 3 | He trabajado con | `clientes` | `Clients.astro` |
| 4 | Qué hago | `servicios` | `Services.astro` |
| 5 | Cómo trabajo | `proceso` | `Process.astro` (nuevo) |
| 6 | Proyectos | `proyectos` | `Projects.astro` + `ProjectCard.astro` |
| 7 | Intuyo | `intuyo` | `Intuyo.astro` |
| 8 | Quién soy | `sobre-mi` | `About.astro` |
| 9 | Contacto | `contacto` | `Contact.astro` |
| 10 | Footer | — | `Footer.astro` |

`About` deja de recibir `<slot />` con Services y Clients. Cada sección es independiente y vive dentro de `<main>`.

## 3. Header

- `<header>` con `sticky top-0 z-50`, fondo `bg-cream`. Mantiene la altura actual (`h-20`) y el logo de 60 px, alineado a la izquierda en desktop.
- **Desktop (≥ md):** logo, `<nav aria-label="Secciones">` con 4 anclas y botón `btn btn-red` "Hablemos".
  - Anclas: Servicios → `#servicios`, Proyectos → `#proyectos`, Intuyo → `#intuyo`, Contacto → `#contacto`.
- **Móvil (< md):** logo y botón "Hablemos". La `<nav>` lleva `hidden md:flex`, sin hamburguesa.
- "Hablemos" usa `site.contact.whatsapp` (con mensaje prellenado), abre en pestaña nueva con `rel="noopener noreferrer"`.
- `html` recibe `scroll-padding-top: 96px` (header de 80 px más 16 px de aire) y `scroll-behavior: smooth` solo dentro de `@media (prefers-reduced-motion: no-preference)`.
- Las anclas del menú salen de `site.nav: { label: string; href: string }[]` en `src/data/site.ts`.
- El header actual tiene `mt-6`. Pasa a `top-0` sin margen superior, para que no quede un hueco al hacer scroll.

## 4. Hero

- Sin cambios de texto.
- Se agrega un botón secundario "Ver proyectos" (`site.hero.secondaryCta`) a `#proyectos`, con la clase nueva `.btn-outline`: borde de 2 px navy, texto navy y hover con fondo navy y texto blanco.
- Los dos botones van en fila con `gap`. En móvil pueden pasar a dos líneas (`flex-wrap`).

## 5. Clientes

- Pasa a estar directamente bajo el hero, fuera de About, con contenedor centrado `max-w-[860px] px-6`.
- El h2 pill pasa de "He trabajado" a "He trabajado con" (`site.clientsLabel`).
- Los logos se muestran en escala de grises con opacidad (`grayscale opacity-70`) y recuperan el color al pasar el mouse (`hover:grayscale-0 hover:opacity-100`, con transición).

## 6. Servicios ("Qué hago")

- Sección propia, contenedor `max-w-[860px] px-6`.
- Tiene un h2 visible con pill "Qué hago" (`site.servicesLabel`).
- Las tarjetas y los textos de `services.ts` no cambian.

## 7. Cómo trabajo (nuevo)

Los datos van en `src/data/process.ts`:

```ts
export interface Step { number: string; title: string; text: string }
// Se llama `steps` (no `process`) para no chocar con el global `process` de Node
export const steps: Step[] = [
  { number: '01', title: 'Entender', text: 'Conversamos sobre tu idea, tus clientes y el objetivo del negocio.' },
  { number: '02', title: 'Prototipar', text: 'Diseño en Figma y lo validamos antes de escribir código.' },
  { number: '03', title: 'Construir', text: 'Desarrollo con herramientas de IA para avanzar más rápido sin perder calidad.' },
  { number: '04', title: 'Lanzar y mejorar', text: 'Publicamos, medimos cómo lo usan y ajustamos.' },
];
```

- La sección es `<section id="proceso">` con h2 pill "Cómo trabajo" (`site.processLabel`), contenedor `max-w-[860px] px-6`.
- Los pasos van en `<ol>` en grilla: `grid-cols-1`, `md:grid-cols-4`.
- Cada `<li>` lleva:
  - el número en `font-display` de 48 px en color aqua, marcado `aria-hidden="true"`, porque `<ol>` ya da el orden;
  - un `h3` en navy con el título;
  - un `<p>` con el texto.

## 8. Proyectos

- `Project` suma `description?: string`.
- `ProjectCard` renderiza `<p>` debajo de la captura solo si existe `description`. Hoy ningún proyecto la tiene, así que el resultado visual es idéntico.

## 9. Intuyo

- Va después de Proyectos. Mantiene el fondo, la tarjeta blanca, la pill "Estoy creando", el badge, el texto y el wordmark.
- Se agregan dos datos en `site.intuyo`:
  - `status: 'La web de Intuyo está en desarrollo.'`, que se muestra en texto chico bajo el párrafo;
  - `instagram: 'https://www.instagram.com/intuyo.dev/'` y `ctaLabel: 'Sigue el proyecto en Instagram'`.
- El botón `btn btn-red` abre Instagram en pestaña nueva con `rel="noopener noreferrer"`.

## 10. Quién soy

- Foto, bio con link a Blubear y segundo párrafo.
- Sin botones de redes: la columna derecha desaparece y la grilla queda en `md:grid-cols-[110px_1fr]`.
- Instagram sale de `site.socials`. `socials` queda con LinkedIn, GitHub y Behance.

## 11. Contacto

- El título, el acento y el texto no cambian.
- WhatsApp es el botón principal: `btn btn-red`, ancho completo, con el ícono a la izquierda.
- Calendly y el correo quedan debajo como secundarios, con el estilo actual (ícono navy y botón cream).
- El orden en el DOM es WhatsApp, Calendly y correo, igual que hoy.

## 12. Footer

- Fondo navy, texto blanco, centrado. Arriba van:
  - una fila de links a las redes (`site.socials`) más "Intuyo" (`site.intuyo.instagram`);
  - el correo `hola@pamartinez.com` como `mailto:`.
- Abajo, la línea actual: "Pablo Martínez · © {año}".
- Los links externos abren en pestaña nueva con `rel="noopener noreferrer"`.

## 13. Decoración

Los círculos SVG decorativos de About y Contact están posicionados con offsets absolutos pensados para el orden anterior. Se reubican o eliminan según la revisión visual: no pueden tapar texto ni provocar scroll horizontal. El wrapper `overflow-clip` de `BaseLayout` se mantiene.

## 14. Accesibilidad

- Un solo `h1` y un `h2` por sección (Proyectos mantiene su h2 `sr-only`).
- El foco visible se mantiene en todos los links y botones.
- Las anclas del header son `<a>` normales y funcionan sin JS.

## 15. Tests (`node:test` sobre `dist/`)

Se agregan o actualizan:

- **Orden:** los `id` de las secciones dentro de `<main>` aparecen en el orden de §2.
- **Header:**
  - `nav` con 4 anclas y sus `href` exactos;
  - botón "Hablemos" con el link de WhatsApp y `isSafeExternal`;
  - el header tiene la clase `sticky`.
- **Hero:** el link "Ver proyectos" apunta a `#proyectos`.
- **Proceso:** `#proceso` tiene un `ol` con 4 `li`, y los títulos en orden son Entender, Prototipar, Construir y Lanzar y mejorar.
- **Proyectos:** sin `description`, ninguna tarjeta renderiza el `<p>` extra.
- **Intuyo:** CTA "Sigue el proyecto en Instagram" con el link de Instagram y `isSafeExternal`, más el texto de estado.
- **Quién soy:** `#sobre-mi` no contiene `[data-social]`.
- **Footer:**
  - links a LinkedIn, GitHub y Behance más Intuyo, todos con `isSafeExternal`;
  - el `mailto:hola@pamartinez.com`.
- **Contacto:** el primer link es WhatsApp y tiene la clase `btn-red`.
- **`links.test`:** se mantiene igual. Todos los destinos siguen presentes.

La verificación manual es visual a 375, 790 y 1280 px: sin scroll horizontal, sin superposiciones y con el header fijo que no tapa los títulos al navegar por las anclas.

## 16. Fuera de alcance

Testimonios, casos de estudio por proyecto, analítica, contraste AA, animaciones, menú hamburguesa y textos de `description` de los proyectos.
