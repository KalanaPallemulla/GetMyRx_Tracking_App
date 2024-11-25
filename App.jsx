import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import Login from './app/pages/Login';
import TrackingScreen from './app/pages/TrakingScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrdersListScreen from './app/pages/OrderListScreen';
import OTPVerificationScreen from './app/pages/OtpVerificationScreen';
import TrackingDetailsScreen from './app/pages/TrackingDetailsScreen';
import NewOrder from './app/pages/NewOrder';
import {getStore} from './app/stores/asyncStore';
import storeKeys from './app/stores/storeKeys';
import {Provider} from 'react-redux';
import store from './app/redux/store';
import CustomerOrders from './app/pages/CustomerOrders';
import CustomerOrderDetails from './app/pages/CustomerOrderDetails';

const Stack = createNativeStackNavigator();

function App() {
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const accessToken = await getStore(storeKeys.token);
      setToken(accessToken);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <Provider store={store}>
        <FlashMessage />
        <NavigationContainer>
          <Stack.Navigator initialRouteName={token ? 'orderList' : 'login'}>
            <Stack.Screen
              options={{headerShown: false, gestureEnabled: false}}
              name="login"
              component={Login}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="otpverification"
              component={OTPVerificationScreen}
            />
            <Stack.Screen
              options={{headerShown: false, gestureEnabled: false}}
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
            <Stack.Screen
              options={{headerShown: false}}
              name="newOrder"
              component={NewOrder}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="customerOrders"
              component={CustomerOrders}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="customerOrderDetails"
              component={CustomerOrderDetails}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
