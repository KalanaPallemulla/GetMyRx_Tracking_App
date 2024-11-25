import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome6';
import Logo from '../../assets/logo.png';
export default function TrackingInputScreen() {
  const navigation = useNavigation();

  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = () => {
    console.log('Submitted tracking number:', trackingNumber);
    // Add your tracking logic here
    navigation.navigate('trakingDetails', trackingNumber);
    setTrackingNumber('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D49D84" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FAIcon name="arrow-left" size={24} color="#D49D84" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cargo Optix</Text>
        <TouchableOpacity accessibilityLabel="Menu">
          {/* <Icon name="menu" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.gradientBackground}>
        <View style={styles.cardContainer}>
          <Text style={styles.timeText}>11:46:12</Text>
          <Image
            source={Logo}
            style={styles.cardImage}
            accessibilityLabel="Package image"
          />
          <Text style={styles.dateText}>12/07{'\n'}2022</Text>
          <Text style={styles.cardText}>+1 6754{'\n'}card</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Track your package.</Text>
        <Text style={styles.subtitle}>
          Enter your tracking number to get real-time updates on your delivery
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tracking Number"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            placeholderTextColor="#A0AEC0"
            accessibilityLabel="Enter tracking number"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            accessibilityLabel="Submit tracking number">
            <Icon name="arrow-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D49D84',
  },
  gradientBackground: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardContainer: {
    width: 200,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#4A5568',
    alignSelf: 'flex-end',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#4A5568',
  },
  cardText: {
    fontSize: 14,
    color: '#4A5568',
    alignSelf: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A202C',
  },
  submitButton: {
    width: 50,
    height: 50,
    backgroundColor: '#D49D84',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
