import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  Home,
  Clock,
  FileText,
  ChevronRight,
} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {getNewOrdersRequest} from '../../api/apiCalls';

const {width} = Dimensions.get('window');

const OrderItem = ({order, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.orderHeader}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>Order #{order.order_number}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                order.status_name === 'Pending' ? '#4CAF50' : '#FFA000',
            },
          ]}>
          <Text style={styles.orderStatus}>{order.status_name}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Package stroke="#D49D84" width={24} height={24} />
      </View>
    </View>

    <View style={styles.orderDetails}>
      <View style={styles.detailRow}>
        <Calendar stroke="#D49D84" width={20} height={20} />
        <Text style={styles.detailText}>Created: {order.created}</Text>
      </View>
      <View style={styles.detailRow}>
        <Calendar stroke="#D49D84" width={20} height={20} />
        <Text style={styles.detailText}>Deliver: {order.deliver_on}</Text>
      </View>
      <View style={styles.detailRow}>
        <MapPin stroke="#D49D84" width={20} height={20} />
        <Text style={styles.detailText}>{order.address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Home stroke="#D49D84" width={20} height={20} />
        <Text style={styles.detailText}>{order.pharmacy_name}</Text>
      </View>
      <View style={styles.detailRow}>
        <FileText stroke="#D49D84" width={20} height={20} />
        <Text style={styles.detailText}>
          {order.notes || 'No additional notes'}
        </Text>
      </View>
    </View>

    <View style={styles.imagesSection}>
      <Text style={styles.imagesTitle}>Uploaded Images</Text>
      <View style={styles.imageContainer}>
        {/* {order.images.map((image, index) => (
          <Image key={index} source={{uri: image}} style={styles.image} />
        ))} */}
        {order.prescription_url1 && (
          <Image source={{uri: order.prescription_url1}} style={styles.image} />
        )}
        {order.prescription_url2 && (
          <Image source={{uri: order.prescription_url2}} style={styles.image} />
        )}
        {order.prescription_url3 && (
          <Image source={{uri: order.prescription_url3}} style={styles.image} />
        )}
      </View>
    </View>

    <View style={styles.footer}>
      <Text style={styles.viewDetailsText}>View Full Details</Text>
      <ChevronRight stroke="#D49D84" width={24} height={24} />
    </View>
  </TouchableOpacity>
);

const CustomerOrderCard = ({orders}) => {
  const navigation = useNavigation();
  const [orders1, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getNewOrdersRequest();
        console.log(res);
        if (res.status === 200) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  console.log('Orders', orders1);
  const renderItem = ({item}) => (
    <OrderItem
      order={item}
      onPress={() => navigation.navigate('customerOrderDetails', {order: item})}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <ArrowLeft stroke="#FFFFFF" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.title}>My Orders</Text>
        </View>
        <FlatList
          data={orders1}
          renderItem={renderItem}
          keyExtractor={item => item.order_number}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EBE7',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#D49D84',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5EBE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  imagesSection: {
    marginBottom: 16,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  viewDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D49D84',
    marginRight: 8,
  },
});

export default CustomerOrderCard;
