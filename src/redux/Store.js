import { configureStore} from '@reduxjs/toolkit'
import authenticatedReducer from './slices/authenticated'

export const store = configureStore({
  reducer: {
    authenticationSlice: authenticatedReducer,
  },
})
