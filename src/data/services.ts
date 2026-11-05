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
    title: 'Diseño',
    accent: 'UX',
    description: 'Ordeno tu idea en pantallas claras y la pruebo con personas reales antes de escribir código.',
    items: ['Investigación con usuarios', 'Prototipos navegables en Figma', 'Diseño de interfaces (UI)'],
    icon: iconUx,
    iconSide: 'left',
  },
  {
    title: 'Desarrollo',
    accent: 'digital',
    description:
      'Convierto el diseño en una web o app rápida, que funciona en cualquier dispositivo y es fácil de mantener.',
    items: ['Sitios y aplicaciones web', 'Apps móviles', 'Desarrollo acelerado con IA'],
    icon: iconWeb,
    iconSide: 'right',
  },
];
