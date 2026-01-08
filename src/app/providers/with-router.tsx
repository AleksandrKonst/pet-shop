import { ComponentType, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const withRouter = (Component: ComponentType) => {
  const WithRouter = () => {
    return (
      <BrowserRouter>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Component />
        </Suspense>
      </BrowserRouter>
    );
  };
  WithRouter.displayName = `withRouter(${Component.displayName || Component.name || 'Component'})`;
  return WithRouter;
};
