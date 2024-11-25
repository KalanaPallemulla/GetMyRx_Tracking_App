import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {optSentRequest} from '../../api/apiCalls';
import {showAlert} from '../../utils/common';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (phoneNumber.length > 6) {
      setIsLoading(true);
      try {
        const res = await optSentRequest(phoneNumber);
        if (res.status === 200)
          navigation.navigate('otpverification', {phoneNumber});
        setIsLoading(false);
      } catch (error) {
        showAlert({message: 'Please check your phone number', type: 'error'});
        setIsLoading(false);
      }
    }
    // navigation.navigate('otpverification', {phoneNumber});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        {/* <LinearGradient
          colors={['#FFB17A', '#E5A87F', '#D49D84']}
          style={styles.gradient}> */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/login1.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to continue
          </Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#E5A87F" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="+44 999 999 999"
              placeholderTextColor="#9a9c9b"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity
            style={[styles.button, {opacity: isLoading ? 0.7 : 1}]}
            onPress={isLoading ? () => {} : handleContinue}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Processing...' : 'Continue'}
            </Text>
            {!isLoading && (
              <Icon
                name="arrow-right"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
            )}
          </TouchableOpacity>
        </View>
        {/* </LinearGradient> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#c0c4c1',
    textAlign: 'left',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#D49D84',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
