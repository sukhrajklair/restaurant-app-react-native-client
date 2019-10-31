import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Loading } from './components/LoadingComponent'
import { ConfigureStore } from './redux/configureStore';

const { persistor, store } = ConfigureStore();

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


