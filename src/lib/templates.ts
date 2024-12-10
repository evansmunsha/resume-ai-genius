

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
  {
    id: 'template3',
    name: 'Creative',
    font: 'Georgia',
    style: { backgroundColor: '#fff3e0' }
  },
  {
    id: 'template4',
    name: 'Elegant',
    font: 'Garamond',
    style: { backgroundColor: '#fce4ec' }
  },
  {
    id: 'template5',
    name: 'Professional',
    font: 'Arial',
    style: { backgroundColor: '#e3f2fd' }
  },
  {
    id: 'template6',
    name: 'Minimalist',
    font: 'Calibri',
    style: { backgroundColor: '#fafafa' }
  },
  {
    id: 'template7',
    name: 'Bold',
    font: 'Trebuchet MS',
    style: { backgroundColor: '#fff8e1' }
  },
  {
    id: 'template8',
    name: 'Artistic',
    font: 'Cambria',
    style: { backgroundColor: '#e8f5e9' }
  },
  {
    id: 'template9',
    name: 'Corporate',
    font: 'Georgia',
    style: { backgroundColor: '#e8eaf6' }
  },
  {
    id: 'template10',
    name: 'Casual',
    font: 'Verdana',
    style: { backgroundColor: '#f3e5f5' }
  },
  {
    id: 'template11',
    name: 'Vintage',
    font: 'Times New Roman',
    style: { backgroundColor: '#fff3e0' }
  },
  {
    id: 'template12',
    name: 'Tech',
    font: 'Helvetica',
    style: { backgroundColor: '#e0f7fa' }
  },
  {
    id: 'template13',
    name: 'Formal',
    font: 'Garamond',
    style: { backgroundColor: '#f1f8e9' }
  },
  {
    id: 'template14',
    name: 'Friendly',
    font: 'Calibri',
    style: { backgroundColor: '#e1f5fe' }
  },
  {
    id: 'template15',
    name: 'Sophisticated',
    font: 'Georgia',
    style: { backgroundColor: '#fafafa' }
  }
]; 