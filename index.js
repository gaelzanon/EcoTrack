import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsyncStorageContext from './contexts/AsyncStorageContext';
const AppWithProvider = () => (
  <AsyncStorageContext>
    <App />
  </AsyncStorageContext>
);

AppRegistry.registerComponent(appName, () => AppWithProvider);
