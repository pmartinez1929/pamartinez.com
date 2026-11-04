# Migración de pamartinez.com a Astro — Diseño

- **Fecha:** 2026-11-04
- **Estado:** Aprobado en chat, pendiente de revisión escrita
- **Repo:** https://github.com/pmartinez1929/pamartinez.com
- **Vault:** `SecondBrain PM/Personal/Projects/Pamartinez/Web Pamartinez.md` (Feature) + Decisions `Migracion a Astro`, `Deploy en Hosting Compartido`

## 1. Contexto

pamartinez.com es una landing de una sola página construida con Gatsby 5.14.1. No hay código fuente disponible: solo el build publicado en el hosting PHP compartido. El repo de GitHub está vacío.

Secciones actuales, en orden:

1. **Header**: logo `icon_pmartinez`.
2. **Hero**: "Desarrollador Front-end & diseñador UX", bajada y CTA "Contáctanos".
3. **Intuyo**: "Entusiasta de" + logo `text_intuyo` sobre fondo `back_intuyo.jpg`, con texto descriptivo.
4. **Quién soy**: foto `profile`, bio (≈8 años, Blubear.io) y redes (LinkedIn, GitHub, Behance, Instagram).
5. **Servicios**: Desarrollo digital (`icon_web`) y Diseño UX (`icon_ux`), cada uno con su lista.
6. **He trabajado**: logos 1001, herrera, corpomedica, maret, verde.
7. **Proyectos**: 6 tarjetas con captura, ícono de tecnología y CTA "Visitar" o "Explorar": 1001carros, OAG Pro, Corpo Médica, PetHomie (Figma), Maxus, Valiente.
8. **Contacto**: "¿Tienes una idea? conecta", con WhatsApp, Calendly y correo.
9. **Footer**: "Pablo Martínez · © {año}".

## 2. Objetivo y alcance

**Opción B**: migrar a Astro + Tailwind manteniendo el diseño actual. El contenido migra **tal cual** en esta fase y queda en archivos de datos para actualizarlo después sin tocar componentes.

**Incluye:** paridad visual y de contenido, imágenes optimizadas, SEO técnico básico, configuración para hosting compartido, deploy manual y workflow de GitHub Actions por FTP, y README.

**No incluye:** el contenido nuevo (se hace en una iteración posterior), blog, páginas de detalle de proyectos, animaciones, formulario de contacto propio ni analítica.

## 3. Enfoque elegido

One-page en **Astro (output estático) + Tailwind CSS v4**, con un componente `.astro` por sección y el contenido en `src/data/*.ts` tipado. Sin frameworks de UI ni JavaScript en el cliente.

Descartados:
- **Content Collections:** estructura innecesaria hoy. Es migrable después si aparecen blog o páginas de detalle.
- **Port 1:1 del HTML de Gatsby:** no aprovecha Tailwind y arrastra CSS modules.

## 4. Arquitectura

```
astro.config.mjs          site: https://pamartinez.com, output static, build.format 'directory', sitemap, tailwind (vite plugin)
src/
  layouts/BaseLayout.astro    <html lang="es">, meta SEO/OG/Twitter, canonical, favicon, manifest, fuentes
  pages/index.astro           ensambla secciones
  pages/404.astro             página 404 simple con link al inicio
  components/
    Header.astro  Hero.astro  Intuyo.astro  About.astro  Services.astro
    Clients.astro Projects.astro ProjectCard.astro Contact.astro Footer.astro
  data/
    site.ts       nombre, rol, descripción SEO, contacto (whatsapp, calendly, email), redes
    services.ts   [{ title, accent, description, items[], icon }]
    clients.ts    [{ name, logo, url? }]
    projects.ts   [{ name, url, image, techIcon, cta: 'Visitar' | 'Explorar' }]
  assets/         imágenes procesadas por astro:assets (logos, capturas, perfil, íconos, fondo, svgs decorativos)
  styles/global.css  @import "tailwindcss"; @theme { colores, fuentes }
public/
  favicon-32x32.png  icons/icon-*.png  manifest.webmanifest (corregido)  robots.txt  .htaccess
.github/workflows/deploy.yml
README.md
```

**Interfaces:** cada componente de sección importa sus datos de `src/data/*` y no recibe props. Solo `ProjectCard` recibe `project` como prop. Los tipos se exportan desde cada archivo de datos.

## 5. Estilo

- **Tokens** (`@theme`): `navy #1D3557`, `blue #457B9D`, `aqua #A8DADC`, `cream #F1FAEE`, `red #E63946`, `ink #1E1E1E`, `muted #B1B1B1`.
- **Tipografía:** Vidaloka para títulos (`font-display`) y Quicksand 400/500 para el texto (`font-sans`), autoalojadas con `@fontsource`.
- **Layout:** mobile-first, contenedor centrado. Referencia visual: el sitio actual en 1280px y 375px.
- **Imágenes:** `<Image>`/`<Picture>` de `astro:assets` con `alt` descriptivo. Los SVG decorativos (`circles`, `circles_red`) se tratan como imágenes con `alt=""`.

## 6. SEO y accesibilidad

- `title` "Pablo A Martínez | Frontend Developer y UX Designer", meta description, canonical, Open Graph y Twitter card (imagen: captura o perfil).
- `@astrojs/sitemap` y `robots.txt` apuntando al sitemap.
- Un solo `h1` (hero) y `h2` por sección.
- Links externos con `target="_blank" rel="noopener noreferrer"`. Links `mailto:`/WhatsApp correctos.
- Contraste AA sobre los fondos de la paleta y foco visible.

## 7. Hosting y deploy

- **Build:** `npm run build` genera `dist/`, que va a la raíz pública (`public_html`).
- **`.htaccess`:** forzar HTTPS, `ErrorDocument 404 /404.html`, gzip/deflate para text/css/js/svg/json, `Cache-Control: public, max-age=31536000, immutable` para `/_astro/`, cache corto para HTML.
- **Manual:** documentado en el README.
- **Automático:** `.github/workflows/deploy.yml` que se ejecuta en push a `main` y con `workflow_dispatch`. Hace checkout, Node 24 (engines: >=22.23.4, requerido por Astro 7), `npm ci`, `npm test` (build + tests) y luego `SamKirkland/FTP-Deploy-Action` con `local-dir: ./dist/`. Usa los secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` y `FTP_DIR`, y opcionalmente las variables `FTP_PROTOCOL`/`FTP_PORT`. El deploy solo corre desde `main`, con los cuatro secrets presentes y `FTP_DIR` terminando en `/`; si no, se omite (`if`) y el build igual valida. Los secrets solo se exponen al paso gate y al de deploy, no a `npm ci`/`npm test`.
- **Riesgo:** el deploy por FTP sobrescribe archivos del hosting. La primera vez conviene un respaldo manual del `public_html` actual.

## 8. Assets

Descargados desde el sitio publicado a `_assets-old/` (fuera del repo vía `.gitignore`), con las extensiones corregidas (Gatsby servía PNG con extensión `.svg`). Se copian a `src/assets/` con nombres en kebab-case.

**Limitación:** los logos e íconos de tecnología son PNG de ~50px y pueden verse suaves en retina. Mejora futura: reemplazarlos por SVG oficiales.

## 9. Verificación

1. `npx astro check` sin errores.
2. `npm run build` sin errores ni warnings de imágenes.
3. `npm run preview` y comparación visual contra pamartinez.com en 1280px y 375px, en el navegador integrado: mismas secciones, textos y links.
4. Revisión de links: los 14 enlaces externos actuales presentes y correctos.
5. `dist/` contiene `.htaccess`, `404.html`, `sitemap-index.xml`, `robots.txt` y `manifest.webmanifest`.

## 10. Git

Se ejecuta `git init` en `htdocs/pamartinez` con remote `origin` apuntando al repo y rama `main`. No se hace push sin aprobación explícita.
