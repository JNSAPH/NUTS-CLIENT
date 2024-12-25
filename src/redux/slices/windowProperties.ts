import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentWindow } from '@tauri-apps/api/window';

interface WindowPropertiesState {
  isFullScreen: boolean;
  title: string;
  selectedTab: AvailableTabs;
}

export type AvailableTabs = 'explorer' | 'settings';

const initialState: WindowPropertiesState = {
  isFullScreen: false,
  title: 'NUTS - NATS Client',
  selectedTab: 'explorer',
};

const windowPropertiesSlice = createSlice({
  name: 'windowProperties',
  initialState,
  reducers: {
    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      const window = getCurrentWindow();
      window.setTitle(action.payload);

      state.title = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<AvailableTabs>) => {
      state.selectedTab = action.payload;
  },
  },
});

export const { toggleFullScreen, setTitle, setSelectedTab } = windowPropertiesSlice.actions;
export default windowPropertiesSlice.reducer;
