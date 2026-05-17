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
  ActivityIndicator,
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
import Loading from '../../components/Loading';
import {removeStore} from '../../stores/asyncStore';
import storeKeys from '../../stores/storeKeys';

const {width} = Dimensions.get('window');

const ImageWithLoader = ({uri}) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.imageContainer}>
      {loading && (
        <View style={styles.imageContainer}>
          <View
            style={{
              width: (width - 64) / 3,
              height: (width - 64) / 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      )}
      <Image
        source={{uri}}
        style={styles.image}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

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
        <Package stroke="#ffa022" width={24} height={24} />
      </View>
    </View>

    <View style={styles.orderDetails}>
      <View style={styles.detailRow}>
        <Calendar stroke="#ffa022" width={20} height={20} />
        <Text style={styles.detailText}>Created: {order.created}</Text>
      </View>
      <View style={styles.detailRow}>
        <Calendar stroke="#ffa022" width={20} height={20} />
        <Text style={styles.detailText}>Deliver: {order.deliver_on}</Text>
      </View>
      <View style={styles.detailRow}>
        <MapPin stroke="#ffa022" width={20} height={20} />
        <Text style={styles.detailText}>{order.address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Home stroke="#ffa022" width={20} height={20} />
        <Text style={styles.detailText}>{order.pharmacy_name}</Text>
      </View>
      <View style={styles.detailRow}>
        <FileText stroke="#ffa022" width={20} height={20} />
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
          <ImageWithLoader uri={order.prescription_url1} />
        )}
        {order.prescription_url2 && (
          <ImageWithLoader uri={order.prescription_url2} />
        )}
        {order.prescription_url3 && (
          <ImageWithLoader uri={order.prescription_url3} />
        )}
      </View>
    </View>

    <View style={styles.footer}>
      <Text style={styles.viewDetailsText}>View Full Details</Text>
      <ChevronRight stroke="#ffa022" width={24} height={24} />
    </View>
  </TouchableOpacity>
);

const CustomerOrderCard = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    await removeStore(storeKeys.token);
    await removeStore(storeKeys.userId);
    await removeStore(storeKeys.first_name);
    await removeStore(storeKeys.last_name);
    await removeStore(storeKeys.phone_number);

    navigation.navigate('login');
  };
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getNewOrdersRequest();
        console.log('getNewOrdersRequest', res.status);
        if (res.status === 200) {
          setOrders(res.data.data);
          setIsLoading(false);
        }
        setIsLoading(false);
        if (res.status === 401) {
          await handleLogOut();
        }
      } catch (error) {
        console.log('getNewOrdersRequest====>', error);
        setIsLoading(false);
      }
    })();
  }, []);

  const renderItem = ({item}) => (
    <OrderItem
      order={item}
      onPress={() => navigation.navigate('customerOrderDetails', {order: item})}
    />
  );

  return (
    <>
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
            data={orders}
            renderItem={renderItem}
            keyExtractor={item => item.order_number}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </SafeAreaView>
      {isLoading && <Loading />}
    </>
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
    backgroundColor: '#ffa022',
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
    color: '#ffa022',
    marginRight: 8,
  },
});

export default CustomerOrderCard;
