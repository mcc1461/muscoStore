// src/slices/apiSlice.js

"use strict";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "./authSlice"; // Adjust the import path if necessary

const BASE_URL = import.meta.env.VITE_APP_API_URL;

// Define a list of endpoints that do not require the Authorization header
const noAuthEndpoints = ["loginUser", "registerUser"];

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers, { endpoint }) => {
    // Log the current endpoint for debugging
    console.log("Preparing headers for endpoint:", endpoint);

    if (noAuthEndpoints.includes(endpoint)) {
      // Do not include the Authorization header for auth-related endpoints
      return headers;
    }

    // Get the userInfo from localStorage
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        const token = userInfo.accessToken;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
      }
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Make the initial request
  let result = await baseQuery(args, api, extraOptions);

  // If a 401 error is received, attempt to refresh the token
  if (result.error && result.error.status === 401) {
    console.warn("Received 401 Unauthorized. Attempting to refresh token.");

    // Get the refreshToken from userInfo
    const userInfoStr = localStorage.getItem("userInfo");
    let refreshToken = null;

    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        refreshToken = userInfo.refreshToken;
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
      }
    }

    if (refreshToken) {
      console.log("Attempting to refresh access token using refresh token.");

      // Attempt to refresh the access token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken }, // Adjust based on your backend's expected payload
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        console.log("Token refresh successful. Updating tokens.");

        // Extract new tokens from the refresh response
        const newAccessToken = refreshResult.data.bearer.accessToken;
        const newRefreshToken = refreshResult.data.bearer.refreshToken;

        // Update userInfo in localStorage
        const userInfo = JSON.parse(userInfoStr);
        const updatedUserInfo = {
          ...userInfo,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

        // Update the Redux store with new tokens
        api.dispatch(setCredentials(updatedUserInfo));

        // Retry the original request with the new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error("Token refresh failed. Logging out.");
        api.dispatch(logout());
        localStorage.removeItem("userInfo");
      }
    } else {
      console.error("No refresh token available. Logging out.");
      api.dispatch(logout());
      localStorage.removeItem("userInfo");
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth, // Use the enhanced baseQuery with re-authentication
  tagTypes: ["User", "Firm"], // Add other tag types as needed
  endpoints: (builder) => ({
    // Registration mutation
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      onQueryStarted: async (userData, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Registration response:", data); // Debugging

          if (
            data.bearer &&
            data.bearer.accessToken &&
            data.bearer.refreshToken &&
            data.user
          ) {
            // Combine user info with tokens
            const userInfoWithToken = {
              ...data.user,
              accessToken: data.bearer.accessToken,
              refreshToken: data.bearer.refreshToken,
            };

            // Dispatch setCredentials to update Redux store and localStorage
            dispatch(setCredentials(userInfoWithToken));

            console.log("User registered and tokens stored.");
          } else {
            console.error("No tokens found in registration response.");
          }
        } catch (error) {
          console.error("Registration error:", error);
        }
      },
    }),

    // Login mutation
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login", // Endpoint for login
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (credentials, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Login response:", data); // Debugging

          if (
            data.bearer &&
            data.bearer.accessToken &&
            data.bearer.refreshToken &&
            data.user
          ) {
            // Combine user info with tokens
            const userInfoWithToken = {
              ...data.user,
              accessToken: data.bearer.accessToken,
              refreshToken: data.bearer.refreshToken,
            };

            // Dispatch setCredentials to update Redux store and localStorage
            dispatch(setCredentials(userInfoWithToken));

            console.log("User logged in and tokens stored.");
          } else {
            console.error("No tokens found in login response.");
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    // Get user by ID
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Logout mutation
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          await queryFulfilled;
          dispatch(logout());
          localStorage.removeItem("userInfo");
          console.log("User logged out successfully.");
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLogoutUserMutation,
} = apiSlice;
