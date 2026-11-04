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
