import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import {getTokenRequest, loginRequest} from '../../api/apiCalls';
import {showAlert} from '../../utils/common';
import storeKeys from '../../stores/storeKeys';
import {saveStore} from '../../stores/asyncStore';
import {useNavigation} from '@react-navigation/native';
const OTPVerificationScreen = ({route}) => {
  console.log('route', route.params.phoneNumber);
  const navigation = useNavigation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await loginRequest(route.params.phoneNumber, otp.join(''));
      if (res.status === 200) {
        if (res.data.status !== 1) {
          showAlert({
            message: 'Please check and re-enter otp code',
            type: 'error',
          });
        } else {
          const tokenRes = await getTokenRequest(
            route.params.phoneNumber,
            otp.join(''),
          );
          if (tokenRes.status === 200) {
            console.log('res.data.access_token', res.data);
            await saveStore(storeKeys.token, tokenRes.data.access_token);
            await saveStore(storeKeys.userId, res.data.data.user_id);
            await saveStore(storeKeys.first_name, res.data.data.first_name);
            await saveStore(storeKeys.last_name, res.data.data.last_name);
            await saveStore(
              storeKeys.phone_number,
              res.data.data.mobile_number,
            );
            navigation.navigate('orderList');
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    // navigation.navigate('orderList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          We have sent the verification code to your phone number (
          {route.params.phoneNumber})
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={ref => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/login.jpg')}
          style={styles.image}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#D49D84',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#D49D84',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OTPVerificationScreen;
