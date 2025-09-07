export default function (plop) {
  // Server Component Generator
  plop.setGenerator('server-component', {
    description: 'Next.js Server Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:'
      },
      {
        type: 'input',
        name: 'path',
        message: 'Component path (default: src/components):',
        default: 'src/components'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '{{path}}/{{pascalCase name}}.tsx',
        templateFile: 'templates/server-component.hbs'
      }
    ]
  });

  // Client Component Generator
  plop.setGenerator('client-component', {
    description: 'Next.js Client Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:'
      },
      {
        type: 'input',
        name: 'path',
        message: 'Component path (default: src/components):',
        default: 'src/components'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '{{path}}/{{pascalCase name}}.tsx',
        templateFile: 'templates/client-component.hbs'
      }
    ]
  });

  // Page Component Generator
  plop.setGenerator('page-component', {
    description: 'Next.js Page Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Page name:'
      },
      {
        type: 'input',
        name: 'path',
        message: 'Page path (default: src/app):',
        default: 'src/app'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '{{path}}/{{kebabCase name}}/page.tsx',
        templateFile: 'templates/page.hbs'
      }
    ]
  });
}