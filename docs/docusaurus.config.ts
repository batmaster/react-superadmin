import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'React SuperAdmin',
  tagline: 'Powerful React framework for building CRUD admin interfaces',
  favicon: 'img/favicon.ico',
  url: 'https://your-domain.com',
  baseUrl: '/',
  organizationName: 'react-superadmin',
  projectName: 'react-superadmin',

  // Search configuration
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://gitlab.com/batmaster/react-superadmin/edit/main/docs/',
          routeBasePath: '/',
          // Enable MDX for component rendering
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Add MDX support for component rendering
  markdown: {
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  // Enable live code examples
  themes: ['@docusaurus/theme-live-codeblock'],

  // Custom search implementation using Fuse.js
  // No plugins needed for custom search

  themeConfig: {
    navbar: {
      title: 'React SuperAdmin',
      logo: {
        alt: 'React SuperAdmin Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        // Search handled by custom navbar component
        {
          href: 'https://gitlab.com/batmaster/react-superadmin',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/introduction',
            },
            {
              label: 'Components',
              to: '/components/button',
            },
            {
              label: 'Examples',
              to: '/examples/basic-usage',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://gitlab.com/batmaster/react-superadmin',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} React SuperAdmin. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'tsx'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
