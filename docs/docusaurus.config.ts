import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import path from 'path';
import { fileURLToPath } from 'url';
import { getEnvironmentUrl } from './config/environments';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Config = {
  title: 'React SuperAdmin',
  tagline: 'Powerful React framework for building CRUD admin interfaces',
  favicon: 'img/favicon.ico',
  url: getEnvironmentUrl(),
  baseUrl: '/',
  organizationName: 'react-superadmin',
  projectName: 'react-superadmin',

  // Search configuration
  onBrokenLinks: 'warn',
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
            'https://github.com/batmaster/react-superadmin/edit/main/docs/',
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

  themes: ['@docusaurus/theme-live-codeblock'],

  // Add MDX support for component rendering
  markdown: {
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  // Search configuration - using local search plugin with proper settings
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: 'right',
        // Fix for search indexing
        indexDocs: true,
        searchContextByPaths: ['docs'],
        // Ensure proper indexing
        docsRouteBasePath: ['docs'],
        ignoreFiles: [],
        indexPages: true,
        docsDir: ['docs'],
      },
    ],
    // Inline plugin to alias monorepo packages for MDX/live examples
    function resolveMonorepoPackages() {
      return {
        name: 'resolve-monorepo-packages',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                // Avoid importing Node Prisma client during docs build
                '@prisma/client': path.resolve(
                  __dirname,
                  './src/shims/prismaClientStub.js'
                ),
                '@react-superadmin/web': path.resolve(
                  __dirname,
                  '../packages/web/src'
                ),
                '@react-superadmin/core': path.resolve(
                  __dirname,
                  '../packages/core/src'
                ),
              },
            },
          };
        },
      };
    },
  ],

  themeConfig: {
    liveCodeBlock: {
      /**
       * The position of the live playground, above or under the editor
       * Possible values: "top" | "bottom"
       */
      playgroundPosition: 'bottom',
    },
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
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/batmaster/react-superadmin',
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
              label: 'Features',
              to: '/features',
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
              href: 'https://github.com/batmaster/react-superadmin',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} React SuperAdmin. Built with Docusaurus.`,
    },
    prism: {
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
