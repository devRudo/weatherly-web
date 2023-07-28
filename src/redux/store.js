import { combineReducers, configureStore } from "@reduxjs/toolkit";
import locationsReducer from "./features/locations/locationsSlice";
import settingsReducer from "./features/settings/settingsSlice";

// import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    locations: locationsReducer,
    settings: settingsReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
