import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Loading } from './components/LoadingComponent'
import { ConfigureStore } from './redux/configureStore';

const { persistor, store } = ConfigureStore();

// To see all the requests in the chrome Dev tools in the network tab.
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest;

  // fetch logger
global._fetch = fetch;
global.fetch = function (uri, options, ...args) {
  return global._fetch(uri, options, ...args).then((response) => {
    console.log('Fetch', { request: { uri, options, ...args }, response });
    return response;
  });
};

export default function App() {
  return (
    <Provider store = {store} >
      <PersistGate
        loading = {<Loading />}
        persistor = {persistor}
      >
        <Main />
      </PersistGate>
    </Provider>
  );
}


