import { createSlice } from '@reduxjs/toolkit';
import { IconType } from 'react-icons';
import { TiHome } from 'react-icons/ti';
import { AppState } from './store';

export type DirectoryMenuItem = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

interface DirectoryMenu {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
}

export const initialDefaultMenuItem: DirectoryMenuItem = {
  displayText: 'Home',
  link: '/',
  icon: TiHome,
  iconColor: 'black',
};

export const initialDefaultMenuState: DirectoryMenu = {
  isOpen: false,
  selectedMenuItem: initialDefaultMenuItem,
};

export const defaltMenuSlice = createSlice({
  name: 'defaultMenu',
  initialState: initialDefaultMenuState,
  reducers: {
    // Actions to set the state
    setIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    setSelectedMenuItem(state, action) {
      state.selectedMenuItem = action.payload;
    },
  },
});

export const { setIsOpen, setSelectedMenuItem } = defaltMenuSlice.actions;

export const selectDirectoryMenuState = (state: AppState) => state.defaultMenu;

export default defaltMenuSlice.reducer;
