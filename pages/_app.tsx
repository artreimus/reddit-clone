import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../chakra/theme';
import Layout from '../components/Layout';
import { Provider } from 'react-redux';
import { wrapper } from '../store/store';

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>{' '}
      </ChakraProvider>
    </Provider>
  );
}

export default App;
