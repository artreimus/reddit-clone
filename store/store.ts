import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { authModalSlice } from './modalSlice';
import { communitiesSlice } from './communitiesSlice';
import { postsSlice } from './postsSlice';
import { defaltMenuSlice } from './directoryMenuSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      [authModalSlice.name]: authModalSlice.reducer,
      [communitiesSlice.name]: communitiesSlice.reducer,
      [postsSlice.name]: postsSlice.reducer,
      [defaltMenuSlice.name]: defaltMenuSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    devTools: false,
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
