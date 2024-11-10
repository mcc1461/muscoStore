// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/api/auth/authSlice";
import productReducer from "./features/api/products/productSlice";
import { apiSlice } from "./features/api/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store; // Default export
