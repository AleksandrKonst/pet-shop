import { ComponentType } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/shared/lib/store';

export const withStore = (Component: ComponentType) => {
  const WithStore = () => {
    return (
      <Provider store={store}>
        <Component />
      </Provider>
    );
  };
  WithStore.displayName = `withStore(${Component.displayName || Component.name || 'Component'})`;
  return WithStore;
};
