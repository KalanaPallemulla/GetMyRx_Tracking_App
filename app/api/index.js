import axios from 'axios';
// import Config from 'react-native-config';
import {getStore} from '../stores/asyncStore';
import storeKeys from '../stores/storeKeys';
const BASE_URL = 'https://uatapi.getmyrx.ca/';

export default async function doRequest(
  url,
  method = 'GET',
  data = null,
  contentType = 'application/json',
  headers = {},
) {
  const maxRetries = 3;
  const options = {
    method,
    url,

    baseURL: BASE_URL, // Replace with your API base URL
    timeout: 50000, // Set timeout (in milliseconds) for requests
    headers: {
      'Content-Type': contentType,
      ...headers,
    },
  };
  if (data) {
    options.data = data;
  }
  if (url !== 'v3/deliveryboy/login' || url !== 'oauth2/token') {
    const accessToken = await getStore(storeKeys.token);
    options.headers.Authorization = `Bearer ${accessToken}`;
  }

  const sendRequestWithRetry = async retryCount => {
    try {
      const response = await axios(options);
      return response;
    } catch (error) {
      console.log('api error =====>>>??????????', error);
      if (retryCount > 0) {
        console.log(
          `Request failed. Retrying... (Attempts left: ${retryCount})`,
        );
        return sendRequestWithRetry(retryCount - 1);
      } else {
        console.log(error);
        return error;
      }
    }
  };

  return sendRequestWithRetry(maxRetries);
}
