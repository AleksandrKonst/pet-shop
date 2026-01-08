import { ComponentType } from 'react';
import { withRouter } from './with-router';
import { withStore } from './with-store';
import { withTheme } from './with-theme';

export const withProviders = (Component: ComponentType) => {
  return withRouter(withStore(withTheme(Component)));
};
