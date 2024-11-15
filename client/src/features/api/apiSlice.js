// src/features/api/apiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../auth/authSlice";

// Set BASE_URL to match your backend's root (without /api)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8061";

console.log("BASE_URL:", BASE_URL);

// Define the baseQuery with authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL, // Corrected baseUrl
  credentials: "include", // Include cookies if needed
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper to handle token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If unauthorized, attempt to refresh the token
  if (result.error && result.error.status === 401) {
    console.log("401 Unauthorized. Attempting to refresh token...");

    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { user, bearer } = refreshResult.data;
      const { accessToken } = bearer;

      // Update the store with new credentials
      api.dispatch(
        setCredentials({
          user,
          token: accessToken,
        })
      );

      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logout the user if refresh fails
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }), // Use the wrapped baseQuery
  tagTypes: ["Product", "User", "Product", "Brand", "Category", "Firm"], // Define tag types for caching
  endpoints: (builder) => ({
    // Products Endpoints
    getProducts: builder.query({
      query: () => "/api/products", // Correct path relative to BASE_URL
      providesTags: (result = [], error, arg) => [
        ...result.map(({ id }) => ({ type: "Product", id })),
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`, // Correct path
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/api/products", // Correct path
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: `/api/products/${updatedProduct._id}`, // Correct path
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "Product", id: _id },
      ],
    }),

    // User Authentication Endpoints
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login", // Corrected to match backend
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT_USER" }],
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register", // Corrected to match backend
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token", // Corrected to match backend
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT_USER" }],
    }),
    // Add more user-related endpoints as needed
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
  useLoginUserMutation,
  useRegisterUserMutation,
  useRefreshTokenMutation,
} = apiSlice;

export default apiSlice;
