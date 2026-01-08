import { withProviders } from './providers';
import { AppRouter } from './router';

const App = () => {
  return <AppRouter />;
};

export default withProviders(App);
