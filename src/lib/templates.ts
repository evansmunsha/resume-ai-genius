export interface Template {
  id: string;
  name: string;
  font: string;
  style: {
    backgroundColor: string;
  };
}

export const coverLetterTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Classic',
    font: 'Times New Roman',
    style: { backgroundColor: '#ffffff' }
  },
  {
    id: 'template2',
    name: 'Modern',
    font: 'Helvetica',
    style: { backgroundColor: '#f8f9fa' }
  },
  // Load others dynamically
];

// Preload common templates
const preloadTemplates = () => {
  if (typeof window !== 'undefined') {
    const commonTemplates = ['modern', 'classic']
    commonTemplates.forEach(template => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `/templates/${template}.js`
      document.head.appendChild(link)
    })
  }
} 