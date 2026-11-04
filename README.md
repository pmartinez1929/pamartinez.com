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
