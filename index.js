/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import App from './src/App';
import {name as appName} from './app.json';
import background from './src/screens/background';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => background,
);
