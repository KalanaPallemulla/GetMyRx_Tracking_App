/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs(true);

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
