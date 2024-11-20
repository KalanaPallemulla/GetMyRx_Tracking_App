import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
type Order = {
  id: string;
  pharmacyName: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryBoy: string;
  amountToBeCollected: number;
  noOfPackages: number;
  createdTime: string;
  status: 'Ongoing' | 'Completed' | 'Unable';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ongoing':
      return '#10B981';
    case 'Completed':
      return '#3B82F6';
    case 'Unable':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const OrderCard: React.FC<{order: Order}> = ({order}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('trakingDetails' as never)}
      style={styles.container}>
      <View style={styles.secondSection}>
        <Text style={[styles.status, {color: getStatusColor(order.status)}]}>
          {order.status === 'Unable' ? 'Unable to deliver' : order.status}
        </Text>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={require('../../assets/package.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={{marginLeft: 4}}>{order.noOfPackages}</Text>
        </View>
      </View>
      <View style={styles.line} />

      <View style={styles.sectionOne}>
        <View style={styles.imageView}>
          <Image
            source={require('../../assets/checklist.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.sectionOneDetails}>
          <Text style={styles.pharmacyText}>{order.pharmacyName}</Text>
          <Text style={styles.createdTimeText}>
            Created time: {order.createdTime}
          </Text>
        </View>
      </View>

      <View style={styles.line} />
      <View style={styles.sectionOne}>
        <View style={styles.imageView}>
          <Image
            source={require('../../assets/location.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.sectionOneDetails}>
          <Text style={styles.pharmacyText}>{order.deliveryAddress}</Text>
          {/* <Text style={styles.createdTimeText}>
            Created time: {order.createdTime}
          </Text> */}
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.bottomSection}>
        <Text style={styles.viewMore}>View More</Text>
        <Text>$ {order.amountToBeCollected}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D49D84',
    padding: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'column',
  },
  sectionOne: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageView: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f3f2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 24,
    height: 24,
  },
  pharmacyText: {
    fontSize: 16,
  },
  sectionOneDetails: {
    marginLeft: 16,
    // gap: 4,
  },
  createdTimeText: {
    fontSize: 12,
    marginTop: 2,
    color: '#636160',
  },
  line: {
    height: 1,
    width: '100%',
    // padding: 10,
    backgroundColor: '#dbdad9',
    marginVertical: 8,
  },
  secondSection: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  status: {
    padding: 6,
    fontWeight: '800',
    fontSize: 16,
    borderRadius: 20,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  viewMore: {
    color: 'blue',
  },
});
