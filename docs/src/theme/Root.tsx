import React from 'react';
import { MDXComponentsProvider } from '../../mdx-components';

// Custom theme that wraps the entire app with MDX components
export default function CustomTheme(props: { children: React.ReactNode }) {
  return (
    <MDXComponentsProvider>
      {props.children}
    </MDXComponentsProvider>
  );
}
