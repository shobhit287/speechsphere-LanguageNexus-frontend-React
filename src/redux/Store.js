import { configureStore} from '@reduxjs/toolkit'
import authenticatedReducer from './slices/authenticated'
import modalReducer from './slices/model_popUp'

export const store = configureStore({
  reducer: {
    authenticationSlice: authenticatedReducer,
    modalSlice:modalReducer,
  },
})
