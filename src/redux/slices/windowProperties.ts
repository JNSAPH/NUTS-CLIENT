import Logger from '@/services/logging';
import { ClientSettings } from '@/types/Settings';
import { isUpdateAvailableResponse } from '@/types/UpdateStuff';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentWindow } from '@tauri-apps/api/window';

interface WindowPropertiesState {
  isFullScreen: boolean;
  title: string;
  selectedTab: AvailableTabs;
  updateInfo: isUpdateAvailableResponse | null;
  lastSeenVersion: string;
  clientSettings: ClientSettings; 
}

export type AvailableTabs = 'explorer' | 'settings';

const initialState: WindowPropertiesState = {
  isFullScreen: false,
  title: 'Orbit',
  selectedTab: 'explorer',
  updateInfo: null,
  lastSeenVersion: '0.0.0',
  clientSettings: {
    hideUpdateNotifications: false,
    defaultNATSURL: 'nats://127.0.0.1:4222',
    defaultTimeout: 5,
    showReduxDevTools: false,
    useMonacoEditor: false, 
    monacoEditorLanguage: 'json'
  }
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
    setUpdateInfo: (state, action: PayloadAction<isUpdateAvailableResponse | null>) => {
      state.updateInfo = action.payload;
    },
    setClientSettings: (state, action: PayloadAction<ClientSettings>) => {
      state.clientSettings = action.payload;
    },
    setLastSeenVersion: (state, action: PayloadAction<string>) => {
      state.lastSeenVersion = action.payload;
    }
  },
});

export const { toggleFullScreen, setTitle, setSelectedTab, setUpdateInfo, setClientSettings, setLastSeenVersion } = windowPropertiesSlice.actions;
export default windowPropertiesSlice.reducer;
