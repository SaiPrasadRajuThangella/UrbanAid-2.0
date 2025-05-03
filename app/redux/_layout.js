import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { Text } from 'react-native';

// Assuming you're using React Navigation or a similar router
export default function Layout({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}