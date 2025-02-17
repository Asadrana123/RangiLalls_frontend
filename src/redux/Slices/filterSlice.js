import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    propertyType: '',
    priceRange: '',
    dateFrom: '',
    dateTo: '',
    city: '',
    bank: '',
  },
  appliedFilters: {},
  isFiltersChanged: false,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      const { name, value } = action.payload;
      state.filters[name] = value;
      state.isFiltersChanged = true;
    },
    applyFilters: (state) => {
      state.appliedFilters = { ...state.filters };
      state.isFiltersChanged = false;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { updateFilter, applyFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;