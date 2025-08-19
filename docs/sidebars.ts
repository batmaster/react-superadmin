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
      label: 'Components',
      items: ['components/button', 'components/forms'],
    },
    {
      type: 'category',
      label: 'Developer',
      items: [
        'developer/architecture',
        'developer/setup',
        'developer/api',
        'developer/components',
        'developer/hooks',
        'developer/utilities',
        'developer/testing',
        'developer/contributing',
      ],
    },
  ],
};

export default sidebars;
