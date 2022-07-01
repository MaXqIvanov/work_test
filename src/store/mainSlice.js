import { createSlice } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    user: [{name: "макс"}],
  },
  reducers: {
    addUser(state, action) {
    },
  },
});

export default mainSlice.reducer;
export const { addUser } =
mainSlice.actions;