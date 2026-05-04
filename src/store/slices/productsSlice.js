import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [], // each product should mimic be_hi2ul_products fields (id, category_id, audience_id, name, slug, base_price, etc.)
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) { state.list = action.payload; state.loading = false; state.error = null; },
    addProduct(state, action) { state.list.push(action.payload); },
    updateProduct(state, action) {
      const idx = state.list.findIndex(p => p.id === action.payload.id);
      if (idx >= 0) state.list[idx] = action.payload;
    },
    clearProducts(state) { state.list = []; },
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
  },
});

export const { setProducts, addProduct, updateProduct, clearProducts, setLoading, setError } = productsSlice.actions;
export default productsSlice.reducer;