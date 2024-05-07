import { createSlice } from '@reduxjs/toolkit';
import { verify_token } from '../service/verify_token';

export const check_authenticate_status = () => async (dispatch) => {
    const isAuthenticated = await verify_token();
    if (isAuthenticated){
      dispatch(loggedIn());

    }
    else{
      dispatch(logOut());
    }

};
const initialState = {
    isAuthenticated: false,
};

export const authenticated = createSlice({
  name: "authenticationSlice",
  initialState,
  reducers: {
    loggedIn: (state) => {
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { loggedIn, logOut} = authenticated.actions;


export default authenticated.reducer;