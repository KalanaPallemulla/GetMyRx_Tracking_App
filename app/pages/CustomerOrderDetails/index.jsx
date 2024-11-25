import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  Home,
  Clock,
  FileText,
  Phone,
  User,
} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const CustomerOrderDetails = ({route}) => {
  const navigation = useNavigation();
  const {order} = route.params;

  const renderDetailRow = (icon, label, value) => (
    <View style={styles.detailRow}>
      {icon}
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
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
          <Text style={styles.title}>Order Details</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>Order #{order.id}</Text>
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

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <View style={styles.whiteBackground}>
              {renderDetailRow(
                <Calendar stroke="#D49D84" width={20} height={20} />,
                'Created',
                order.created,
              )}
              {renderDetailRow(
                <Clock stroke="#D49D84" width={20} height={20} />,
                'Deliver on',
                order.deliver_on,
              )}
              {renderDetailRow(
                <MapPin stroke="#D49D84" width={20} height={20} />,
                'Delivery Address',
                order.address,
              )}
              {renderDetailRow(
                <Home stroke="#D49D84" width={20} height={20} />,
                'Pharmacy',
                order.pharmacy_name,
              )}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.whiteBackground}>
              {renderDetailRow(
                <User stroke="#D49D84" width={20} height={20} />,
                'Name',
                order.consumer,
              )}
              {renderDetailRow(
                <Phone stroke="#D49D84" width={20} height={20} />,
                'Phone',
                order.mobile_number,
              )}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <View style={[styles.whiteBackground, styles.notesContainer]}>
              <FileText stroke="#D49D84" width={20} height={20} />
              <Text style={styles.notesText}>
                {order.notes || 'No additional notes'}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Uploaded Images</Text>
            <View style={[styles.whiteBackground, styles.imageContainer]}>
              {order.prescription_url1 && (
                <Image
                  source={{uri: order.prescription_url1}}
                  style={styles.image}
                />
              )}
              {order.prescription_url2 && (
                <Image
                  source={{uri: order.prescription_url2}}
                  style={styles.image}
                />
              )}
              {order.prescription_url3 && (
                <Image
                  source={{uri: order.prescription_url3}}
                  style={styles.image}
                />
              )}
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
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
    fontSize: 24,
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  whiteBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notesText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: (width - 80) / 2,
    height: (width - 80) / 2,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default CustomerOrderDetails;
