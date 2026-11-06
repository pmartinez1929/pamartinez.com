# Medición de pamartinez.com

Todo se carga desde Google Tag Manager (`GTM-5NMPVG2G`). El sitio solo pone el snippet de GTM, el consentimiento y
los atributos `data-track`; las herramientas se agregan o cambian dentro de GTM sin deploy.

## Cómo funciona

- **Consentimiento (Consent Mode v2).** `src/components/Analytics.astro` declara todo en `denied` antes de cargar GTM.
  El banner (`src/components/ConsentBanner.astro`) guarda la elección en `localStorage` (`consent`) y llama a
  `gtag('consent', 'update', …)`. Al aceptar también envía el evento `consent_granted`.
- **Clics.** Cada enlace con `data-track` envía a la capa de datos:
  `{ event: 'click_<tipo>', link_label, link_url }`.

| Evento | Dónde | `link_label` |
|---|---|---|
| `click_whatsapp` | Header, hero, contacto | `header` / `hero` / `contacto` |
| `click_calendly` | Contacto | `contacto` |
| `click_email` | Contacto, footer | `contacto` / `footer` |
| `click_proyecto` | Tarjetas de proyectos | Nombre del proyecto |
| `click_social` | Footer, sección Intuyo | LinkedIn, GitHub, Behance, Intuyo |
| `click_externo` | Sobre mí | Blubear.io |

- GTM solo se carga en el build de producción: `npm run dev` no envía datos.

## Puesta en marcha

1. **GA4.** Crea la propiedad y un flujo web para `https://pamartinez.com`, y copia el ID `G-…`.
   - En *Administrar → Recopilación y conservación de datos*, pon la conservación en **14 meses** (así lo dice
     `/privacidad/`).
   - En *Administrar → Definiciones personalizadas*, crea las dimensiones de evento `link_label` y `link_url`.
2. **Clarity.** Crea el proyecto en clarity.microsoft.com y copia el ID del proyecto (Settings → Overview).
3. **Importa el contenedor.** En GTM, ve a *Administrar → Importar contenedor* y elige
   `docs/medicion/gtm-contenedor.json`.
   - Espacio de trabajo: el existente.
   - Opción: **Combinar → Cambiar el nombre de los objetos en conflicto**.
4. **Configura los IDs.** En *Variables*, edita `GA4 - Measurement ID` y `Clarity - Project ID` con los IDs reales.
5. **Prueba.** Abre *Vista previa*, entra a pamartinez.com, acepta las cookies y haz clic en "Hablemos".
   - En Tag Assistant debe dispararse `GA4 - Evento click_*` con el evento `click_whatsapp`.
   - Si eliges Rechazar, Clarity no debe dispararse.
6. **Publica** el contenedor.
7. **Eventos clave.** En GA4, ve a *Administrar → Eventos* y marca como evento clave `click_whatsapp`,
   `click_calendly` y `click_email`. Los eventos aparecen ahí después de recibir el primero.

## Search Console

Agrega una propiedad de tipo **Dominio** (`pamartinez.com`) y verifícala con el registro TXT en el DNS de Bluehost.
Luego envía el sitemap `https://pamartinez.com/sitemap-index.xml`.

## Más adelante

- **Meta Pixel:** etiqueta nueva en GTM con consentimiento `ad_storage`, cuando haya pauta.
- Si cambias la lista de herramientas, actualiza también `src/pages/privacidad.astro`.
