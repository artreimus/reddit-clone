import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';

export interface ModalState {
  open: boolean;
  view: 'login' | 'signup' | 'resetPassword';
}

const initialState: ModalState = {
  open: false,
  view: 'login',
};

export const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    // Actions to set the state
    setOpen(state, action) {
      state.open = action.payload;
    },
    setView(state, action) {
      state.view = action.payload;
    },
  },
});

export const { setOpen, setView } = authModalSlice.actions;

export const selectAuthModalState = (state: AppState) => state.authModal;

export default authModalSlice.reducer;
