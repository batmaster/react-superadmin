import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'introduction',
        'installation',
        'quick-start',
        'examples/basic-usage',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features',
        'features/data-providers',
        'features/roadmap',
        'features/components-reference',
        'features/hooks-reference',
        'features/implementation-checklist',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/button',
        'components/card',
        'components/modal',
        'components/badge',
        'components/dropdown',
        'components/form',
        'components/forms',
        'components/layout',
        'components/admin',
      ],
    },
    {
      type: 'category',
      label: 'Developer',
      items: [
        'developer/architecture',
        'developer/components',
        'developer/hooks',
        'developer/utilities',
        'developer/environments',
        'developer/testing',
        'developer/cursor-rules',
        'developer/cursor-rules-quick-reference',
        'developer/ci-cd',
        'developer/contributing',
      ],
    },
  ],
};

export default sidebars;
