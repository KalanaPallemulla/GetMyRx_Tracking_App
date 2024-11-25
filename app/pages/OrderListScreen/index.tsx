import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import OrderCard from './OrderCard';
import {getDeliveriesRequest} from '../../api/apiCalls';
import {getStore, removeStore} from '../../stores/asyncStore';
import storeKeys from '../../stores/storeKeys';
import Loading from '../../components/Loading';

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

const mockOrders: Order[] = [
  {
    id: '1',
    pharmacyName: 'MedPlus Pharmacy',
    deliveryAddress: '739 Main Street, Springfield',
    deliveryDate: '2023-05-15',
    deliveryBoy: 'John Doe',
    amountToBeCollected: 50.0,
    noOfPackages: 2,
    createdTime: '2023-05-14T10:30:00Z',
    status: 'Ongoing',
  },
  {
    id: '4',
    pharmacyName: 'MedPlus Pharmacy',
    deliveryAddress: '739 Main Street, Springfield',
    deliveryDate: '2023-05-15',
    deliveryBoy: 'John Doe',
    amountToBeCollected: 50.0,
    noOfPackages: 2,
    createdTime: '2023-05-14T10:30:00Z',
    status: 'Ongoing',
  },
  {
    id: '5',
    pharmacyName: 'MedPlus Pharmacy',
    deliveryAddress: '739 Main Street, Springfield',
    deliveryDate: '2023-05-15',
    deliveryBoy: 'John Doe',
    amountToBeCollected: 50.0,
    noOfPackages: 2,
    createdTime: '2023-05-14T10:30:00Z',
    status: 'Ongoing',
  },
  {
    id: '6',
    pharmacyName: 'MedPlus Pharmacy',
    deliveryAddress: '739 Main Street, Springfield',
    deliveryDate: '2023-05-15',
    deliveryBoy: 'John Doe',
    amountToBeCollected: 50.0,
    noOfPackages: 2,
    createdTime: '2023-05-14T10:30:00Z',
    status: 'Ongoing',
  },
  {
    id: '2',
    pharmacyName: 'HealthMart',
    deliveryAddress: '456 Elm Street, Springfield',
    deliveryDate: '2023-05-16',
    deliveryBoy: 'Jane Smith',
    amountToBeCollected: 75.5,
    noOfPackages: 3,
    createdTime: '2023-05-15T09:15:00Z',
    status: 'Completed',
  },
  {
    id: '3',
    pharmacyName: 'QuickMeds',
    deliveryAddress: '123 Oak Street, Springfield',
    deliveryDate: '2023-05-17',
    deliveryBoy: 'Mike Johnson',
    amountToBeCollected: 30.25,
    noOfPackages: 1,
    createdTime: '2023-05-16T14:45:00Z',
    status: 'Unable',
  },
];

const TabBar: React.FC<{
  activeTab: number;
  setActiveTab: (tab: any) => void;
}> = ({activeTab, setActiveTab}) => {
  return (
    <View style={styles.tabBar}>
      {[
        {id: 2, name: 'Completed'},
        {id: 0, name: 'Ongoing'},
        {id: 5, name: 'Unable'},
      ].map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab)}>
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function OrderHistory() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<any>({id: 0, name: 'Ongoing'});
  const [data, setData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  // const filteredOrders = mockOrders.filter(order => order.status === activeTab);
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      console.log(data.filter((order: any) => order.status === activeTab.id));
      setFilteredOrders(
        data.filter((order: any) => order.status === activeTab.id),
      );
    }
  }, [data, activeTab]);

  async function getData() {
    try {
      setIsLoading(true);
      const uesrId = await getStore(storeKeys.userId);

      const res: any = await getDeliveriesRequest(uesrId);
      if (res.status === 200) {
        setData(res.data.data);
        setIsLoading(false);
      }
      console.log('getDeliveriesRequest', res.data);
    } catch (error) {
      console.log('Error');
      setIsLoading(false);
    }
  }

  const handleLogOut = async () => {
    await removeStore(storeKeys.token);
    await removeStore(storeKeys.userId);
    await removeStore(storeKeys.first_name);
    await removeStore(storeKeys.last_name);
    await removeStore(storeKeys.phone_number);

    navigation.navigate('login' as never);
  };
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#D49D84" />

      <SafeAreaView style={{flex: 0, backgroundColor: '#D49D84'}} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('customerOrders' as never)}>
              <Icon name="list" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('newOrder' as never)}>
              <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('traking' as never)}>
              <Icon name="search" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogOut}>
              <Icon name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <TabBar activeTab={activeTab.id} setActiveTab={setActiveTab} />
        {isLoading ? (
          <View style={{flex: 1}}>
            <Loading />
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={({item}) => <OrderCard order={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.orderList}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={getData} />
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#D49D84',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6e6967',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#D49D84',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orderList: {
    padding: 20,
    gap: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
});
