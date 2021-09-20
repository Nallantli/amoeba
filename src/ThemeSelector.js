import React from 'react';

/**
 * The theme components only imports it's theme CSS-file. These components are lazy
 * loaded, to enable "code splitting" (in order to avoid the themes being bundled together)
 */
const DefaultTheme = React.lazy(() => import('./styles/App'));
const Win98Theme = React.lazy(() => import('./styles/Win98'));

const ThemeSelector = (props) => (
  <>
    {/* Conditionally render theme, based on the current client context */}
    <React.Suspense fallback={() => <div />}>
      {props.theme === 'default' && <DefaultTheme />}
      {props.theme === 'win98' && <Win98Theme />}
    </React.Suspense>
    {/* Render children immediately! */}
    {props.children}
  </>
);

export default ThemeSelector;
