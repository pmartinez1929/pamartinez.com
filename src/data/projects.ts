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

export interface Project {
  name: string;
  url: string;
  image: ImageMetadata;
  tech: { name: string; icon: ImageMetadata };
  cta: 'Visitar' | 'Explorar';
  /** Una línea sobre el problema y lo que se hizo; opcional, la tarjeta la muestra solo si existe. */
  description?: string;
}

const tech = {
  nuxt: { name: 'Nuxt', icon: nuxt },
  vue: { name: 'Vue', icon: vue },
  wordpress: { name: 'WordPress', icon: wordpress },
  figma: { name: 'Figma', icon: figma },
  codeigniter: { name: 'CodeIgniter', icon: codeigniter },
};

export const projects: Project[] = [
  { name: '1001 Carros', url: 'https://1001carros.com/', image: carros, tech: tech.nuxt, cta: 'Visitar' },
  { name: 'OAG Pro', url: 'https://www.oagpro.com/', image: oag, tech: tech.vue, cta: 'Visitar' },
  { name: 'Corpo Médica', url: 'https://corpo-medica.com/', image: corpomedica, tech: tech.wordpress, cta: 'Visitar' },
  {
    name: 'PetHomie',
    url: 'https://www.figma.com/file/rsOXMJBZT28xMy6sdQzJcG/PetHomie?node-id=11%3A298&t=gMvQ7C8RGV3iCeEp-1',
    image: pethomie,
    tech: tech.figma,
    cta: 'Explorar',
  },
  { name: 'Maxus Ecuador', url: 'https://www.maxusecuador.com/', image: maxus, tech: tech.nuxt, cta: 'Visitar' },
  { name: 'Valiente', url: 'https://valiente.pamartinez.com/', image: valiente, tech: tech.codeigniter, cta: 'Visitar' },
];
