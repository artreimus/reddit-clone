import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authModalSlice } from './modalSlice';
import { createWrapper } from 'next-redux-wrapper';
import { communitiesSlice } from './communitiesSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      [authModalSlice.name]: authModalSlice.reducer,
      [communitiesSlice.name]: communitiesSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = ReturnType<AppStore['getState']>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
