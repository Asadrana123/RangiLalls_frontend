import { createSlice } from '@reduxjs/toolkit';
import api from '../../Utils/axios';
export const checkAuthStatus = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await api.get('/auth/me'); // Endpoint to get user data
      dispatch(setSuccess({
        user: response.data.user,
        token: token
      }));
    } catch (error) {
      console.log(error);
      dispatch(logout());
    }
  } else {
    dispatch(logout());
  }
};
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload === true) {
        state.error = null;
      }
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      console.log(action.payload.token);
      state.loading = false;
      state.success = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    resetAuthState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  }
});

export const { 
  setLoading, 
  setError, 
  setSuccess, 
  resetAuthState, 
  logout 
} = authSlice.actions;

export default authSlice.reducer;