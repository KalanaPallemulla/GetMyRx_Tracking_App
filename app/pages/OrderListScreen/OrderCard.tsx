import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
type Order = {
  ddelivery_id: string;
  pharmacy_name: string;
  address: string;
  deliveryDate: string;
  deliveryBoy: string;
  amount_to_be_collected: number;
  no_of_packages: number;
  created: string;
  status: 0 | 2 | 5;
  deliver_on: string;
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return '#10B981';
    case 2:
      return '#3B82F6';
    case 5:
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const OrderCard: React.FC<{order: Order}> = ({order}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('trakingDetails', {id: order.ddelivery_id})
      }
      style={styles.container}>
      <View style={styles.secondSection}>
        <Text style={{fontWeight: '600', color: 'gray', fontSize: 14}}>
          Order Id: 025273
        </Text>
        <Text style={[styles.status, {color: getStatusColor(order.status)}]}>
          {order.status === 5
            ? 'Unable to deliver'
            : order.status === 0
            ? 'Ongoing'
            : 'Completed'}
        </Text>
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
          <Text style={styles.pharmacyText}>{order.pharmacy_name}</Text>
          <Text style={styles.createdTimeText}>
            Created time: {order.created}
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
          <Text numberOfLines={1} style={styles.pharmacyText}>
            {order.address}
          </Text>
          <Text style={styles.createdTimeText}>
            Delivery time: {order.deliver_on}
          </Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.bottomSection}>
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
          <Text style={{marginLeft: 4}}>{order.no_of_packages}</Text>
        </View>
        <Text>$ {order.amount_to_be_collected}</Text>
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
    width: '85%',
    overflow: 'scroll',
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
