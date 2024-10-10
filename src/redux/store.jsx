import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice'


const rootReducer = combineReducers({
	auth: authSlice,
})

const persistConfig = {
	key: "root",
	storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);
export default store;

