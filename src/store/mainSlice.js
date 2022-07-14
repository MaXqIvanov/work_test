import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';

export const getMastersShedule = createAsyncThunk(
  'main/getMastersShedule',
  async (params, action) => {
    console.log(params);
    const response = await api(`portfolio/user_landing/actual_chedule/${params.year}/${params.monthe}/?mst=${params.id}`)
    return response
  }
)

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    shedulesMaster: []
  },
  reducers: {
    addUser(state, action) {
    },
  },
  extraReducers: {
    [getMastersShedule.pending]: (state, action) => {
    },
    [getMastersShedule.fulfilled]: (state, { payload }) => {
      console.log("this is payload");
      console.log(payload);
      state.shedulesMaster = payload.data
    },
    [getMastersShedule.rejected]: (state, action) => {
    },
  }
});


export default mainSlice.reducer;
export const { addUser } =
mainSlice.actions;