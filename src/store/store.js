import { combineReducers, configureStore } from '@reduxjs/toolkit';
import mainES from './mainSlice';

const rootReducer = combineReducers({
  main: mainES,
});

export const store = configureStore({
  reducer: rootReducer,
});