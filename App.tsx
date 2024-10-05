/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet} from 'react-native';

import Login from './pages/Login';
import TrackingScreen from './pages/TrakingScreen';
import TrackingDetailsScreen from './pages/TrackingDetailsScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    // <SafeAreaView style={backgroundStyle}>
    // <Login />
    // <TrackingScreen />
    // <TrackingDetailsScreen />
    // </SafeAreaView>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen
          options={{headerShown: false}}
          name="login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="traking"
          component={TrackingScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="trakingDetails"
          component={TrackingDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
