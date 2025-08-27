export const sidebar = {
  'getting-started': {
    title: 'Getting Started',
    items: [
      { type: 'page', name: 'Introduction', url: '/introduction' },
      { type: 'page', name: 'Installation', url: '/installation' },
    ],
  },
  foundations: {
    title: 'Foundations',
    items: [
      { type: 'page', name: 'Colors', url: '/colors' },
      { type: 'page', name: 'Typography', url: '/typography' },
      { type: 'page', name: 'Icons', url: '/icons' },
    ],
  },
  components: {
    title: 'Components',
    items: [{ type: 'page', name: 'Button', url: '/button' }],
  },
} as const;
