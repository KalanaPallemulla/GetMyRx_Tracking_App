/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// #f8d8c2

import React from 'react';
import {StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import Login from './app/pages/Login';
import TrackingScreen from './app/pages/TrakingScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrdersListScreen from './app/pages/OrderListScreen';
import OTPVerificationScreen from './app/pages/OtpVerificationScreen';
import TrackingDetailsScreen from './app/pages/TrackingDetailsScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    // <SafeAreaView style={backgroundStyle}>
    // <Login />
    // <TrackingScreen />
    // <TrackingDetailsScreen />
    // </SafeAreaView>
    <>
      <FlashMessage />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen
            options={{headerShown: false}}
            name="login"
            component={Login}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="otpverification"
            component={OTPVerificationScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="orderList"
            component={OrdersListScreen}
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
    </>
  );
}

const styles = StyleSheet.create({});

export default App;
