export interface Step {
  number: string;
  title: string;
  text: string;
}

// Se llama `steps` (no `process`) para no chocar con el global `process` de Node
export const steps: Step[] = [
  { number: '01', title: 'Entender', text: 'Conversamos sobre tu idea, tus clientes y el objetivo del negocio.' },
  { number: '02', title: 'Prototipar', text: 'Diseño en Figma y lo validamos antes de escribir código.' },
  { number: '03', title: 'Construir', text: 'Desarrollo con herramientas de IA para avanzar más rápido sin perder calidad.' },
  { number: '04', title: 'Lanzar y mejorar', text: 'Publicamos, medimos cómo lo usan y ajustamos.' },
];
