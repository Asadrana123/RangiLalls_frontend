// src/redux/slices/propertySlice.js
import { createSlice } from '@reduxjs/toolkit';
import api from '../../Utils/axios';

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    properties: [],
    loading: true,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProperties: (state, action) => {
      state.properties = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setLoading, setProperties, setError } = propertySlice.actions;

// Thunk action to fetch properties
export const fetchProperties = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api.get('/properties');
    dispatch(setProperties(response.data.data));
  } catch (error) {
    console.log(error);
    dispatch(setError(error.response?.data?.error || 'Failed to fetch properties'));
  }finally{
    dispatch(setLoading(false));
  }
};

export default propertySlice.reducer;