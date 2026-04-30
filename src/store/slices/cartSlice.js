import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  id: uuidv4(),
  items: [], // { id, cart_id, product_variant_id, product_id, product_name, quantity, unit_price, customization_summary, currency }
  currency: 'EUR',
  updatedAt: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) { return { ...state, ...action.payload }; },
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find(i => i.product_variant_id === item.product_variant_id && JSON.stringify(i.customization_summary || {}) === JSON.stringify(item.customization_summary || {}));
      if (existing) existing.quantity += item.quantity ?? 1;
      else state.items.push({ id: uuidv4(), ...item, quantity: item.quantity ?? 1 });
      state.updatedAt = Date.now();
    },
    updateCartItem(state, action) {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex(i => i.id === id);
      if (idx >= 0) state.items[idx] = { ...state.items[idx], ...changes };
      state.updatedAt = Date.now();
    },
    removeCartItem(state, action) { state.items = state.items.filter(i => i.id !== action.payload); state.updatedAt = Date.now(); },
    clearCart(state) { state.items = []; state.updatedAt = Date.now(); },
  },
});

export const { setCart, addToCart, updateCartItem, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;