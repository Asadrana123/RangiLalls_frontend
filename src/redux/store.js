import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./Slices/authSlice";
import propertyReducer from "./Slices/propertySlice";
export const store = configureStore({
    reducer: {
      auth: authReducer,
      property: propertyReducer
    }
  });
  
  export default store;