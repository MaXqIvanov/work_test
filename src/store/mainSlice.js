import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';
import moment from "moment";

export const getMastersShedule = createAsyncThunk(
  'main/getMastersShedule',
  async (params, action) => {
    const response = await api(`portfolio/user_landing/actual_chedule/${params.year}/${params.monthe}/?mst=${params.id}`)
    return {response, params}
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
      state.shedulesMaster = []
    },
    [getMastersShedule.fulfilled]: (state, { payload }) => {
      let response = payload.response.data
      let day = Number(moment().format('L').split('/')[1]); 
      response = response.map((elem,index)=> {
        if(day >= (Number(elem.date.split('.')[0])) && (moment().year() == payload.params.year)){
          return {...elem, 'working': false}
        }else{
          return {...elem}
        }
      })
      state.shedulesMaster = response
    },
    [getMastersShedule.rejected]: (state, action) => {
    },
  }
});


export default mainSlice.reducer;
export const { addUser } =
mainSlice.actions;