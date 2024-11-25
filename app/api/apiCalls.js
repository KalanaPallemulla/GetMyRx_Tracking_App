import {Platform} from 'react-native';
import {FIREBASE_TOKEN} from '../config';
import doRequest from '.';
import md5 from 'md5';
import axios from 'axios';
import {getStore} from '../stores/asyncStore';
import storeKey from '../stores/storeKeys';

//Login requests
export const optSentRequest = async phoneNumber => {
  const data = {
    mobile_number: phoneNumber,
  };
  return await doRequest('v3/user/requestotp', 'POST', data);
};

export const loginRequest = async (username, password) => {
  const data = {
    username: username,
    password: password,
    device_token: FIREBASE_TOKEN,
    device_type: Platform.OS === 'ios' ? 'ios' : 'android',
    login_type: username,
  };
  try {
    const response = await doRequest('v3/user/login', 'POST', data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getTokenRequest = async (username, password) => {
  const client_id = md5(`${username.toLowerCase()}:${password.toLowerCase()}`);
  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('client_id', client_id);
  formData.append('client_secret', md5(`${password}`));

  const encodedFormData = formData.toString();

  const response = await doRequest(
    'oauth2/token',
    'POST',
    encodedFormData,
    'application/x-www-form-urlencoded',
  );
  return response;
};

//home screen requests

export const getDeliveriesRequest = async user_id => {
  const response = await doRequest(`v3/user/getUserOrders/${user_id}`);
  return response;
};

export const getDeliveriesOptimizedRequest = async (user_id, lat, lng) => {
  const data = {
    lat: lat,
    lng: lng,
  };
  const response = await doRequest(
    `v3/delivery/deliveryboy/optimized/${user_id}`,
    'GET',
    data,
  );
  return response;
};

export const getDriversDataRequest = async user_id => {
  const response = await doRequest(`v3/deliveryboy/all/${user_id}`);
  return response;
};

export const getDriverHistoryDataRequest = async user_id => {
  const response = await doRequest(`v3/delivery/history/${user_id}`);
  return response;
};

export const pickUpOrderRequest = async (userId, orderIds, status) => {
  const data = {
    dids: [...orderIds],
    status: status,
  };
  const response = await doRequest(
    `v3/delivery/pickupmultiple/${userId}`,
    'POST',
    data,
  );
  return response;
};

export const barcodeScanPickupAnotherDriverRequest = async barcode => {
  const userId = await getStore(storeKey.userId);
  const data = {
    signature_url: '',
    status: 21,
    lat: '',
    lng: '',
    amount_collected: '',
    payment_status: '',
    comments: '',
    photos_url: '',
    prescription_collected: '',
    medicaltag_collected: '',
    document_collected: '',
    medicaltag_url: '',
    document_url: '',
    prescription_url: '',
    driver_notes: '',
    driver_id: userId,
    delivery_id: barcode,
  };
  console.log('barcodeScanPickupAnotherDriverRequest', data);
  const response = await doRequest(
    `v3/delivery/update/${barcode}`,
    'POST',
    data,
  );
  return response;
};

export const updateDeliveryRequest = async props => {
  const userId = await getStore(storeKey.userId);
  console.log('updateDeliveryRequest123', userId);
  const data = {
    signature_url: props.photoUrl,
    status: props.status,
    lat: props.lat,
    lng: props.lng,
    amount_collected: props.amountText,
    payment_status:
      props.selectedPaidOption === 'Paid'
        ? 0
        : props.selectedPaidOption === 'Unpaid'
        ? 1
        : 2,
    comments: props.comment,
    photos_url: props.signatureData,
    prescription_collected: props.prescriptionCollected,
    medicaltag_collected: props.medicaTaglCollected,
    document_collected: props.documentCollected,
    medicaltag_url: props.medicalTagUrl,
    document_url: props.documentUrl,
    prescription_url: props.prescriptionUrl,
    driver_notes: props.note,
    driver_id: userId,
    payment_id: props.payment_id,
  };
  const response = await doRequest(
    `v3/delivery/update/${props.delivery_id}`,
    'POST',
    data,
  );
  return response;
};

export const getAwsCredentialsRequest = async user_id => {
  const response = await doRequest(`v3/deliveryboy/creds/${user_id}`);
  return response;
};

export const assignNewDriverRequest = async ({
  delivery_id,
  from_delivery_boy_id,
  to_delivery_boy_id,
  assign_notes,
}) => {
  const data = {
    delivery_id: delivery_id,
    from_delivery_boy_id: from_delivery_boy_id,
    to_delivery_boy_id: to_delivery_boy_id,
    assign_notes: assign_notes,
  };
  const response = await doRequest(`v3/delivery/assign`, 'POST', data);
  return response;
};

export const getTagsRequest = async () => {
  const response = await doRequest('v3/pharmacy/tags');
  return response;
};

export const getPaymentTypesRequest = async () => {
  const response = await doRequest('v3/utilities/getpaymenttype');
  return response;
};

export const getSearchUser = async (input, pharmacy) => {
  console.log('//////////>>>>>>', pharmacy);
  const response = await doRequest(`v3/user/${pharmacy}/${input}`);
  return response;
};

export const getUserAddress = async id => {
  const response = await doRequest(`v3/user/address/${id}`);
  return response;
};

export const getUserPharmaciesRequest = async id => {
  const response = await doRequest(`v3/deliveryboy/pharmacy/${id}`);
  return response;
};

export const createNewOrderRequest = async data => {
  const response = await doRequest(`v3/delivery`, 'POST', data);
  return response;
};

export const getUserAddressSuggetions = async searchKey => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKey}&key=AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA`,
  );
  return response;
};

export const getUserSelectedAddressRequest = async placeId => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA`,
  );

  return response;
};

export const getUserSelectedAddressDataRequest = async (
  latitude,
  longitude,
) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA`,
  );
  return response;
};

export const addNewUserRequest = async data => {
  const response = await doRequest(`v3/user`, 'POST', data);
  return response;
};

export const getUserDetailsById = async id => {
  const response = await doRequest(`v3/user/${id}`);
  return response;
};

export const updateCustomerRequest = async (id, data) => {
  const response = await doRequest(`v3/user/${id}`, 'POST', data);
  return response;
};

export const activeBarcodeRequest = async (id, data) => {
  const response = await doRequest(
    `v3/delivery/updatedeliverybarcode/${id}`,
    'POST',
    data,
  );
  return response;
};
export const getNearestLoaction = async url => {
  const response = await doRequest(url);
  return response;
};

const getFormattedDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1); // Add one minute
  const isoString = now.toISOString(); // This gives us milliseconds precision
  const formattedDate = isoString.replace('Z', '000Z'); // Add extra precision
  return formattedDate;
};
export const getNearestLocationData = async (
  data = [],
  userLocation,
  key = 'distance',
) => {
  let count = [];
  try {
    const promises = data.map(async e => {
      // const response = await getNearestLoaction(
      //   `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLocation.lat},${userLocation.lng}&destinations=${e.lat}, ${e.lng}&mode=driving&key=AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA`,
      // );
      // console.log('response.rows[0].elements[0]?.distance?', response);
      // e[key] =
      //   response.rows[0].elements[0].status === 'ZERO_RESULTS'
      //     ? ''
      //     : response.rows[0].elements[0]?.distance?.text;

      //new
      const apiKey = 'AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA';
      const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

      const body = {
        origin: {
          location: {
            latLng: {
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: e.lat,
              longitude: e.lng,
            },
          },
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_UNAWARE',
        // departureTime: getFormattedDate(),
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: true,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: 'en-US',
        units: 'IMPERIAL',
      };

      const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        'X-Id': e.ddelivery_id,
      };

      const res = await axios.post(url, body, {headers});
      if (res.status === 200 && Object.keys(res.data).length > 0) {
        const distance = res.data.routes
          ? res.data.routes[0].distanceMeters / 1000
          : 0;
        e[key] = parseFloat(distance.toFixed(2));
      }
      count.push(e.ddelivery_id);
      // if(res.data.routes.lengt)
      // console.log('Response' + e.ddelivery_id + ':', res);
      // const distance = res.data.routes
      //   ? res.data.routes[0].distanceMeters / 1000
      //   : 0;
      // e[key] = parseFloat(distance.toFixed(2));
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    return data;
  } catch (error) {
    console.log('CATCH ERROR ++++++>' + count + ':', error);
    // return data;
  }
};

// export const getNearestLocationData = async (
//   data = [],
//   userLocation,
//   key = 'distance',
// ) => {
//   try {
//     const promises = data.map(async e => {
//       console.log('This is optimized call');

//       const response = await getNearestLoaction(
//         `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLocation.lat},${userLocation.lng}&destinations=${e.lat}, ${e.lng}&key=AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA`,
//       );
//       e[key] =
//         response.rows[0].elements[0].status === 'ZERO_RESULTS'
//           ? ''
//           : response.rows[0].elements[0]?.distance?.text;
//     });

//     // Wait for all promises to resolve
//     await Promise.all(promises);

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getDistanceBetweenLocation = async (
  userLocation,
  targetLocation,
) => {
  const response = await getNearestLoaction(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLocation.lat},${userLocation.lng}&destinations=${targetLocation.lat}, ${targetLocation.lng}&key=AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA`,
  );
  return response;
};

export const getNearestLocationDataWithLocation = async (
  data = [],
  userLocation,
  key = 'distance',
) => {
  const promises = data.map(async e => {
    const response = await getNearestLoaction(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLocation.lat},${userLocation.lng}&destinations=${e.lat}, ${e.lng}&key=AIzaSyDi-I1VTLv53R_tkevQR36692dqrlEPDSA`,
    );

    e[key] =
      response.rows[0].elements[0].status === 'ZERO_RESULTS'
        ? ''
        : response.rows[0].elements[0]?.distance?.text;
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  return data;
};

function parseDistance(distanceString) {
  const [value, unit] = distanceString.split(' ');
  const numericValue = parseFloat(value);

  // Convert to meters for a unified comparison
  switch (unit.toLowerCase()) {
    case 'km':
      return numericValue * 1000;
    case 'm':
      return numericValue;
    default:
      return 0; // Handle unsupported units gracefully
  }
}

async function sortByDistance(a, b) {
  const distanceA = parseDistance(a.optimizeOrderDistance);
  const distanceB = parseDistance(b.optimizeOrderDistance);

  return distanceA - distanceB;
}

export const getRateDataRequest = async props => {
  if (props.urgent === 0) {
    try {
      const res = await doRequest(
        `/v3/delivery/getrate/${props.deliveryBoy}?postalcode=${props.postalCode}&office=${props.office}&noofpackages=${props.noofpackages}&ampmpickup=${props.ampmpickup}`,
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('No This request');

    try {
      const res = await doRequest(
        `/v3/delivery/getrate/${props.deliveryBoy}?postalcode=${props.postalCode}&urgent=1&noofkm=${props.distance}&office=${props.office}&noofpackages=${props.noofpackages}&ampmpickup=${props.ampmpickup}`,
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  }
};

export const getPharmacyDetails = async id => {
  try {
    const res = await doRequest(`/v3/pharmacy/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const makeCall = async id => {
  try {
    const res = await doRequest(
      `/v3/delivery/SendNotifications/${id}`,
      'POST',
      {},
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getPharmacyCustomersRequest = async pharmacyId => {
  try {
    return await doRequest(`v3/user/pharmacyusernames/${pharmacyId}`);
  } catch (error) {
    console.log(error);
  }
};

export const addNewOrderRequest = async data => {
  return await doRequest(`v3/user/createCustomerOrder`, 'POST', data);
};

export const getNewOrdersRequest = async () => {
  const userId = await getStore(storeKey.userId);
  return await doRequest(
    `v3/user/getCustomerOrders/${userId}?pharmacy_id=282c0ac8-d004-4d3f-aae6-a24418a989a8`,
  );
};
