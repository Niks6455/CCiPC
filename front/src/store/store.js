import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import basicSlice from './basicSlice/basic.Slice.js';

import reportsSlice from './reportsSlice/reportsSlice.js';
import reportCreateSlice from './reportCreateSlice/reportCreateSlice.js';
import UserSlice from './userSlice/user.Slice.js';
import conferencesSlice from './conferencesSlice/conferences.Slice.js';
import newsSlice from './newsSlice/newsSlice.js';
import participantsSlice from './participantsSlice/participantsSlice.js';
import registrationSlice from './registrationSlice/registrationSlice.js';

const rootReducer = combineReducers({
  BasicSlice: basicSlice,
  reportsSlice: reportsSlice,
  reportCreateSlice: reportCreateSlice,
  user: UserSlice,
  conferences: conferencesSlice,
  news: newsSlice,
  participants: participantsSlice,
  registration: registrationSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['BasicSlice', 'user', 'news', 'reportCreateSlice', 'registration', 'conferences'],
  blacklist: ['reportsSlice', 'participants'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
