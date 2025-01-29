import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import basicSlice from "./basicSlice/basic.Slice.js";

import reportsSlice from "./reportsSlice/reportsSlice.js";
import reportCreateSlice from "./reportCreateSlice/reportCreateSlice.js";

const rootReducer = combineReducers({
  BasicSlice: basicSlice,
  reportsSlice: reportsSlice,
  reportCreateSlice: reportCreateSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["BasicSlice"],
  blacklist: ["reportsSlice", "reportCreateSlice"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
