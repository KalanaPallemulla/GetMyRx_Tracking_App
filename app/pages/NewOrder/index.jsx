import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image as ImageReactNative,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {DatePickerModal} from 'react-native-paper-dates';
import * as ImagePicker from 'react-native-image-picker';
import {
  Camera,
  Check,
  Calendar,
  User,
  MapPin,
  Phone,
  ArrowLeft,
  X,
} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {getStore} from '../../stores/asyncStore';
import storeKeys from '../../stores/storeKeys';
import {useGetAwsTokenQuery} from '../../redux/globalApiSlice';
import {addNewOrderRequest, getAwsCredentialsRequest} from '../../api/apiCalls';
import awsConfigureAndUpload from '../../utils/awsHandler';
import {Image} from 'react-native-compressor';
import Loading from '../../components/Loading';
const {width} = Dimensions.get('window');

const generateUniqueId = () => {
  return `id-${Math.random().toString(36).substr(2, 9)}`;
};
const AmazingNewOrder = () => {
  const navigation = useNavigation();
  const [isDateModelOpen, setIsDateModelOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [images, setImages] = useState([
    {image: null, isLoading: false},
    {image: null, isLoading: false},
    {image: null, isLoading: false},
  ]);
  const [imagesLocations, setImagesLocations] = useState([null, null, null]);

  const [notes, setNotes] = useState('');
  const [awsKey, setAwsKey] = useState({
    key: '',
    secret: '',
  });
  const [uniqueImageName, setUniqueImageName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAwsCredentialsRequest(
          await getStore(storeKeys.userId),
        );
        setAwsKey({
          key: res.data.data.key,
          secret: res.data.data.secret,
        });
      } catch (error) {
        console.log(error);
      }
    })();
    (() => {
      const id = `image-${Math.random().toString(36).substr(2, 9)}`;
      setUniqueImageName(id);
    })();
  }, []);

  const pickImage = index => {
    Alert.alert('Upload Image', 'Choose an option to upload image', [
      {
        text: 'Camera',
        onPress: () => launchCamera(index),
      },
      {
        text: 'Gallery',
        onPress: () => launchImageLibrary(index),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const launchCamera = index => {
    ImagePicker.launchCamera({mediaType: 'photo', quality: 0.5}, response => {
      if (response.didCancel) {
        return;
      }
      handleImagePickerResponse(response, index);
    });
  };

  const launchImageLibrary = index => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', quality: 0.5},
      response => {
        if (response.didCancel) {
          return;
        }
        handleImagePickerResponse(response, index);
      },
    );
  };

  const handleImagePickerResponse = async (response, index) => {
    if (response.assets && response.assets.length > 0) {
      const newImages = [...images];
      newImages[index] = {image: null, isLoading: true};
      setImages(newImages);

      const filePath =
        Platform.OS === 'ios'
          ? response.assets[0].uri.replace('file://', '')
          : response.assets[0].uri;

      const fileName = `${uniqueImageName}_${index + 1}.png`;

      try {
        const result = await Image.compress(filePath, {
          compressionMethod: 'manual',
          maxWidth: 500,
          quality: 0.5,
        });

        const fileData = await fetch(result).then(response => response.blob());
        const res = await awsConfigureAndUpload(
          awsKey.key,
          awsKey.secret,
          fileName,
          fileData,
        );

        const newImagesLocations = [...imagesLocations];
        newImagesLocations[index] = res.Location;

        const updatedImages = [...images];
        updatedImages[index] = {image: res.Location, isLoading: false};
        setImages(updatedImages);
        setImagesLocations(newImagesLocations);
      } catch (error) {
        console.log('Image upload failed', error);

        const updatedImages = [...images];
        updatedImages[index] = {image: null, isLoading: false};
        setImages(updatedImages);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      }
    }
  };

  const deleteImage = index => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    const newImagesLocations = [...imagesLocations];
    newImagesLocations[index] = null;
    setImagesLocations(newImagesLocations);
  };

  const onConfirmDate = params => {
    setIsDateModelOpen(false);
    setDeliveryDate(params.date);
  };

  const handleSumbitOrder = async () => {
    try {
      setIsLoading(true);
      const data = {
        pharmacy_id: '282c0ac8-d004-4d3f-aae6-a24418a989a8',
        user_id: await getStore(storeKeys.userId),
        deliver_on: new Date(deliveryDate).toISOString().split('T')[0],
        notes: notes,
        status: '0',
        prescription_url1: imagesLocations[0],
        prescription_url2: imagesLocations[1],
        prescription_url3: imagesLocations[2],
      };

      const res = await addNewOrderRequest(data);
      console.log(res);
      if (res.status === 200) {
        setNotes('');
        setDeliveryDate(new Date());
        setImages([
          {image: null, isLoading: false},
          {image: null, isLoading: false},
          {image: null, isLoading: false},
        ]);
        setImagesLocations([null, null, null]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  console.log('date', deliveryDate);
  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <ArrowLeft stroke="#FFFFFF" width={20} height={20} />
            </TouchableOpacity>
            <Text style={styles.title}>New Order</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <User stroke="#D49D84" width={16} height={16} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoText}>John Doe</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <MapPin stroke="#D49D84" width={16} height={16} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoText}>
                  No: 37, New Road, New Jersey
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Phone stroke="#D49D84" width={16} height={16} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoText}>+94705274897</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Time</Text>
            <TouchableOpacity
              onPress={() => setIsDateModelOpen(true)}
              style={styles.selectDateButton}>
              <Calendar stroke="#FFFFFF" width={20} height={20} />
              <Text style={styles.selectDateText}>
                {deliveryDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
            <DatePickerModal
              locale="en"
              mode="single"
              visible={isDateModelOpen}
              date={deliveryDate}
              onConfirm={onConfirmDate}
              onDismiss={() => setIsDateModelOpen(false)}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Upload Images</Text>
            <View style={styles.imageRow}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageUploaderContainer}>
                  <TouchableOpacity
                    style={styles.imageUploader}
                    onPress={() => pickImage(index)}
                    disabled={image.isLoading}>
                    {image.isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#white" />
                      </View>
                    ) : image.image ? (
                      <>
                        <ImageReactNative
                          source={{uri: image.image}}
                          style={styles.uploadedImage}
                          onError={() => {
                            Alert.alert(
                              'Error',
                              'Failed to load image. Please try re-uploading.',
                            );
                          }}
                        />
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => deleteImage(index)}>
                          <X stroke="#FFFFFF" width={16} height={16} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <Camera stroke="#FFFFFF" width={20} height={20} />
                        <Text style={styles.uploadText}>Upload</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              numberOfLines={3}
              onChangeText={setNotes}
              value={notes}
              placeholder="Enter any additional notes here..."
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSumbitOrder}>
            <Check stroke="#FFFFFF" width={20} height={20} />
            <Text style={styles.submitButtonText}>Submit Order</Text>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: '#D49D84',
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5EBE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  selectDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#D49D84',
  },
  selectDateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageUploaderContainer: {
    width: width * 0.25,
    aspectRatio: 1,
    position: 'relative',
  },
  imageUploader: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#b8b6b6',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#D49D84',
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    margin: 10,
    backgroundColor: '#D49D84',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default AmazingNewOrder;
