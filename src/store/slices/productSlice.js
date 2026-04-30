import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  item: null, // detailed product object (including variants, images)
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProduct(state, action) { state.item = action.payload; state.loading = false; state.error = null; },
    clearProduct(state) { state.item = null; },
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
  },
});

export const { setProduct, clearProduct, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;