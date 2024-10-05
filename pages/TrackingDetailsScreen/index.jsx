import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  L,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome6';

import Loading from '../../components/Loading';

function formatDate(dateInput) {
  const date = new Date(dateInput);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Format the date
  const formattedDate = `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${
    months[date.getUTCMonth()]
  }`;

  return formattedDate;
}

function formatTime(dateStr) {
  // Create a new Date object
  const date = new Date(dateStr);

  // Get hours and minutes, and format them as 2 digits
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  // Combine the hours and minutes
  const time = `${hours}:${minutes}`;

  return time;
}
const StatusItem = ({icon, title, description, time, isActive, onPress}) => {
  return (
    <TouchableOpacity style={styles.statusItem} onPress={onPress}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={[styles.statusIcon, isActive && styles.activeStatusIcon]}>
          <Icon
            name={icon}
            size={16}
            color={isActive ? '#10B981' : '#9CA3AF'}
          />
        </View>
      </View>
      <View style={styles.statusContent}>
        <Text style={styles.statusTitle}>{title}</Text>
        <Text style={styles.statusDescription}>{description}</Text>
      </View>
      <Text style={styles.statusTime}>{time}</Text>
    </TouchableOpacity>
  );
};
export default function TrackingDetailsScreen({navigation, route}) {
  console.log('route', route);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleStatusPress = imageUrl => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://devapi.getmyrx.ca/v2/delivery/track/${
            route.params ? route.params : '009675'
          }`,
        );
        console.log(response.data.data);
        if (response.status === 200) {
          setData(response.data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    })();
  }, []);

  console.log('modalVisible', modalVisible);
  if (isLoading) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Loading />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Track Order</Text>
            <Text style={styles.headerDate}>
              {data && data.length > 0 && formatDate(data[0].created)}
            </Text>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>
                Order ID: {data && data.length > 0 && data[0].ddelivery_id}
              </Text>
              <FAIcon name={'truck-medical'} size={16} color="#10B981" />

              {/* <Text style={styles.orderAmount}>Amt: $345.00</Text> */}
            </View>
            {/* <View style={styles.etaContainer}>
            <Text style={styles.etaLabel}>ETA: 15 Min</Text>
          </View> */}
          </View>

          <View style={styles.timeline}>
            {/* {data &&
            data.length > 0 &&
            data.some(entry =>
              entry.delivery_status_description.includes('INITIATED'),
            ) && (
              <StatusItem
                icon="check-circle"
                title="Order is Processing"
                description="Order#234562 from Tasty Food"
                time="11:00"
                isActive={true}
              />
            )} */}
            {data.map((item, index) => (
              <>
                <StatusItem
                  key={index}
                  icon={
                    item.delivery_status_description ===
                      'INITIATED - Assigned' ||
                    item.delivery_status_description === 'New Driver - Assigned'
                      ? 'user'
                      : item.delivery_status_description ===
                        'Picked up from the Pharmacy'
                      ? 'shopping-cart'
                      : 'check-circle'
                  }
                  title={item.delivery_status_description}
                  description={formatDate(item.created)}
                  time={formatTime(item.created)}
                  isActive={true}
                  onPress={() => handleStatusPress(item.signature_url)}
                />
                {index !== data.length - 1 && (
                  <View style={[styles.threeDotsIcon]}>
                    <FAIcon
                      name={'ellipsis-vertical'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                )}
              </>
            ))}
            {/* <StatusItem
            icon="credit-card"
            title="Payment Confirmed"
            description="Awaiting confirmation..."
            time="10:06"
            isActive={true}
          />
          <StatusItem
            icon="shopping-bag"
            title="Order Placed"
            description="We have received your order"
            time="10:04"
            isActive={true}
          /> */}
          </View>

          <View style={styles.deliveryAddress}>
            <Icon
              name="home"
              size={20}
              color="#4B5563"
              style={styles.addressIcon}
            />
            <View>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>Home, Work & Other address</Text>
              <Text style={styles.addressText}>
                House No: 1234, Duff Floor, Sector 12,
              </Text>
              <Text style={styles.addressText}>
                Gurgaon, Haryana 122002, India, Near to LIC
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.ratingContainer}>
            <Icon
              name="star"
              size={20}
              color="#FCD34D"
              style={styles.ratingIcon}
            />
            <View>
              <Text style={styles.ratingTitle}>Don't forget to rate</Text>
              <Text style={styles.ratingText}>
                Oh Tasty Kitchen to help your fellow foodies
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Image
                source={{uri: selectedImage}}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Icon name="x" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  orderId: {
    fontSize: 14,
    color: '#4B5563',
  },
  orderAmount: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  etaContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  etaLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  timeline: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // marginBottom: 20,
    // alignContent: 'center',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  threeDotsIcon: {
    width: 32,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeStatusIcon: {
    backgroundColor: '#D1FAE5',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deliveryAddress: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  addressIcon: {
    marginRight: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
  },
  ratingIcon: {
    marginRight: 12,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
