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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import OrderCard from './OrderCard';
import {getDeliveriesRequest} from '../../api/apiCalls';
import {getStore} from '../../stores/asyncStore';
import storeKeys from '../../stores/storeKeys';

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
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({activeTab, setActiveTab}) => {
  return (
    <View style={styles.tabBar}>
      {['Completed', 'Ongoing', 'Unable'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}>
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function OrderHistory() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Ongoing');

  const filteredOrders = mockOrders.filter(order => order.status === activeTab);
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  async function getData() {
    try {
      const uesrId = await getStore(storeKeys.userId);

      const res = await getDeliveriesRequest(uesrId);
      console.log('getDeliveriesRequest', res);
    } catch (error) {
      console.log('Error');
    }
  }
  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#D49D84'}} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('traking' as never)}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <FlatList
          data={filteredOrders}
          renderItem={({item}) => <OrderCard order={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.orderList}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={getData} />
          }
        />
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
});
