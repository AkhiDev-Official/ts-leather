import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [], // each order should mimic be_hi2ul_orders fields (id, order_number, total_amount, shipping_address_snapshot, items, status, ordered_at, etc.)
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action) { state.list = action.payload; state.loading = false; state.error = null; },
    addOrder(state, action) { state.list.unshift(action.payload); },
    updateOrder(state, action) {
      const idx = state.list.findIndex(o => o.id === action.payload.id);
      if (idx >= 0) state.list[idx] = action.payload;
    },
    clearOrders(state) { state.list = []; },
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
  },
});

export const { setOrders, addOrder, updateOrder, clearOrders, setLoading, setError } = ordersSlice.actions;
export default ordersSlice.reducer;