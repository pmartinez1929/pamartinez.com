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
