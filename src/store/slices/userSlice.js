import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // mimic be_hi2ul_users fields (id, email, first_name, last_name, role, etc.)
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) { state.user = action.payload.user ?? action.payload; state.token = action.payload.token ?? state.token; state.loading = false; state.error = null; },
    updateUser(state, action) { state.user = { ...state.user, ...action.payload }; },
    logout(state) { state.user = null; state.token = null; },
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
  },
});

export const { setUser, updateUser, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;