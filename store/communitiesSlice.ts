import { createSlice } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';
import { StringMappingType } from 'typescript';
import { AppState } from './store';

export interface CommunityState {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createdAt?: Timestamp;
  imageURL?: string;
}

// const initialState: CommunityState = {
//   open: false,
//   view: 'login',
// };

// export const authModalSlice = createSlice({
//   name: 'authModal',
//   initialState,
//   reducers: {
//     // Actions to set the state
//     setOpen(state, action) {
//       state.open = action.payload;
//     },
//     setView(state, action) {
//       state.view = action.payload;
//     },
//   },
// });

// export const { setOpen, setView } = authModalSlice.actions;

// export const selectAuthModalState = (state: AppState) => state.authModal;

// export default authModalSlice.reducer;
