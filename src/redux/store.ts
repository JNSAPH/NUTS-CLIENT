import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage for web
import windowPropertiesReducer from "./slices/windowProperties";
import projectFileReducer from "./slices/projectFile";

const persistConfig = {
  key: "root",
  storage, 
  whitelist: ["windowProperties"], 
};

const rootReducer = combineReducers({
  windowProperties: windowPropertiesReducer,
  projectFile: projectFileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create persistor to handle rehydration
const persistor = persistStore(store);

const clearPersistedData = () => {
  persistor.purge();
};

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor, clearPersistedData };
