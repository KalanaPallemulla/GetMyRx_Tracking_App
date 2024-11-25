import {createSlice} from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    aws: {
      key: '',
      secret: '',
    },
  },
  reducers: {
    setAwsToken: (state, action) => {
      state.aws.token = action.payload.aws_token;
      state.aws.secret = action.payload.aws_secret;
    },
    clearAwsToken: state => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {setAwsToken, clearAwsToken} = globalSlice.actions;
export default globalSlice.reducer;
