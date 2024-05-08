import { createSlice } from '@reduxjs/toolkit';
const initialState={
    signup_modal:false,
    login_modal:false
}
export const modalPopUp = createSlice({
    name: "modalPopupSlice",
    initialState,
    reducers: {
      signup_modal_handle: (state,action) => {
        state.signup_modal = action.payload;
      },
      login_modal_handle: (state,action) => {
        state.login_modal = action.payload;
      },
    },
  });
  export const {signup_modal_handle,login_modal_handle } = modalPopUp.actions;


export default modalPopUp.reducer;