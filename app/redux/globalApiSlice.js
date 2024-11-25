import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const globalApiSlice = createApi({
  reducerPath: 'awsApi', // Unique key for the API slice
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://uatapi.getmyrx.ca/v3/deliveryboy/creds/', // Replace with your API base URL
  }),
  endpoints: builder => ({
    getAwsToken: builder.query({
      query: params => ({
        url: `${params.id}`,
        method: 'GET',
      }),
      // Log the response here
      transformResponse: (response, meta) => {
        console.log('AWS Token Response:', response);
        console.log('Meta Information:', meta);
        return response; // Return the original or modified response
      },
    }),
  }),
});

export const {useGetAwsTokenQuery} = globalApiSlice;
