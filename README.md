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

## Flujo de trabajo (ramas y PR)

`main` está protegida: todo lo que entra se publica en pamartinez.com, y solo se actualiza mediante Pull Request con el check `build-deploy` en verde. No se hace push directo a `main`.

Prefijos de rama:

| Prefijo | Uso | Ejemplo |
| --- | --- | --- |
| `feat/` | Funcionalidad o sección nueva | `feat/blog` |
| `fix/` | Corrección | `fix/footer-espacio` |
| `content/` | Textos, proyectos, imágenes | `content/actualizar-proyectos` |
| `ci/` / `chore/` | Configuración, dependencias, workflow | `ci/flujo-ramas` |

```bash
git switch main && git pull                  # partir de main actualizado
git switch -c content/actualizar-proyectos   # rama nueva
# ...cambios...
npm test                                     # validar en local
git add -A && git commit -m "content: actualizar proyectos"
git push -u origin content/actualizar-proyectos
```

Luego abre el PR hacia `main` en GitHub. El workflow compila y ejecuta los tests en el PR, **sin desplegar**. Con el check en verde, haz **Squash and merge**: el push resultante a `main` despliega solo. Después:

```bash
git switch main && git pull && git branch -d content/actualizar-proyectos
```

## Deploy

### Manual

```bash
npm run build
```

Sube **el contenido** de `dist/` (incluido `.htaccess`, que es un archivo oculto) a `public_html` por FTP o el administrador de archivos de cPanel. Antes del primer deploy, respalda el `public_html` actual.

#### Antes del primer deploy

1. Respalda `public_html` completo y guarda una copia del `.htaccess` actual para compararlo. El hosting (Bluehost/Newfold) puede tener reglas propias, y el nuevo `.htaccess` usa `Options` y `Require`, que necesitan `AllowOverride`. Si el sitio devuelve 500 tras el deploy, restaura el `.htaccess` anterior y combínalos.
2. Con el respaldo hecho, borra de `public_html` los restos del sitio Gatsby: `404/`, `page-data/`, `static/`, `dev-404-page/`, los `*.js` y `*.js.map` de la raíz (`app-*.js`, etc.), `webpack.stats.json`, `chunk-map.json`. **No toques** carpetas de subdominios como `valiente/` ni otras carpetas o archivos que no sean de Gatsby.

#### Después del primer deploy (smoke test)

```bash
curl -I https://pamartinez.com/                       # 200
curl -I https://pamartinez.com/_astro/<archivo>.css   # Cache-Control con immutable
curl -I https://pamartinez.com/no-existe              # 404
```

### Automático (GitHub Actions)

`.github/workflows/deploy.yml` compila, ejecuta los tests y sube `dist/` por FTP en cada push a `main` (es decir, al hacer merge de un PR), o manualmente desde la pestaña Actions. En los PR solo compila y testea: los secrets no se exponen y no se despliega.

Configura en **Settings → Secrets and variables → Actions**:

| Tipo | Nombre | Ejemplo |
| --- | --- | --- |
| Secret | `FTP_SERVER` | `ftp.pamartinez.com` |
| Secret | `FTP_USERNAME` | usuario FTP |
| Secret | `FTP_PASSWORD` | contraseña FTP |
| Secret | `FTP_DIR` | `/public_html/` (debe terminar en `/`) |
| Variable (opcional) | `FTP_PROTOCOL` | `ftps` (por defecto), `ftp` o `ftps-legacy` |
| Variable (opcional) | `FTP_PORT` | `21` |

El deploy solo se ejecuta desde `main`, con los cuatro secrets (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_DIR`) y si `FTP_DIR` termina en `/`; en cualquier otro caso el workflow compila y valida pero no despliega. Los secrets solo se exponen al paso de verificación y al de deploy, no a `npm ci` ni `npm test`.
