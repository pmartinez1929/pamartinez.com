// Los años de experiencia se calculan en cada build a partir de este año
const startYear = 2015;
const years = new Date().getFullYear() - startYear;

const whatsappMessage = 'Hola Pablo, vi tu web y quiero conversar sobre un proyecto.';

export const site = {
  name: 'Pablo Martínez',
  url: 'https://pamartinez.com',
  title: 'Pablo A Martínez | Diseñador de producto y desarrollador',
  description:
    'Combino diseño UX, desarrollo y herramientas de IA para llevar tu idea a una web o app real, más rápido y sin perder calidad.',
  twitter: '@pmartinez1929',
  contact: {
    whatsapp: `https://api.whatsapp.com/send?phone=593995027973&text=${encodeURIComponent(whatsappMessage)}`,
    calendly: 'https://calendly.com/pmartinez1929/reunion',
    email: 'hola@pamartinez.com',
  },
  hero: {
    titleLine1: 'Diseñador de producto',
    titleLine2: 'desarrollador',
    cta: 'Hablemos',
    secondaryCta: 'Ver proyectos',
  },
  company: { name: 'Blubear.io', url: 'https://blubear.io/' },
  nav: [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Intuyo', href: '#intuyo' },
    { label: 'Contacto', href: '#contacto' },
  ],
  intuyo: {
    name: 'Intuyo',
    label: 'Estoy creando',
    text: 'Intuyo es el proyecto que estoy construyendo para analizar, idear y mejorar la experiencia de los usuarios en entornos digitales: sistemas que cumplen los objetivos del negocio y están pensados para las personas que los usan.',
    status: 'La web de Intuyo está en desarrollo.',
    instagram: 'https://www.instagram.com/intuyo.dev/',
    ctaLabel: 'Sigue el proyecto en Instagram',
  },
  about: {
    label: 'Quién soy',
    bioBefore: `Soy Pablo Martínez, desarrollador Front-end con más de ${years} años de experiencia creando productos digitales para distintas marcas. Actualmente trabajo en`,
    text: 'Soy curioso y autodidacta. Me gusta entender qué necesita realmente una idea y cómo convertirla en un producto digital que la gente use.',
  },
  projectsLabel: 'Proyectos',
  processLabel: 'Cómo trabajo',
  clientsLabel: 'He trabajado con',
  servicesLabel: 'Qué hago',
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/pmartinezesp/' },
    { label: 'GitHub', url: 'https://github.com/pmartinez1929' },
    { label: 'Behance', url: 'https://www.behance.net/pablomartinez102' },
  ],
  cta: {
    title: '¿Tienes una idea?',
    accent: 'conecta',
    text: 'Conversemos sobre cómo convertir tu idea en una solución digital y qué pasos necesitas para lograrlo.',
    whatsapp: 'Escríbeme por WhatsApp',
    calendly: 'Agenda una reunión gratuita',
    email: 'Escríbeme un correo',
  },
};
