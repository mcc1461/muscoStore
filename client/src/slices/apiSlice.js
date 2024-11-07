import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice"; // Adjust the import path if necessary

const BASE_URL = import.meta.env.VITE_APP_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers, { endpoint }) => {
    // List of endpoints that do not require authentication
    const noAuthEndpoints = ["registerUser", "loginUser"];
    if (noAuthEndpoints.includes(endpoint)) {
      // Do not include the Authorization header
      return headers;
    }
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Include the token in the Authorization header
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // First, make the base query
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      // Attempt to refresh the access token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { bearer: { refreshToken } },
        },
        api,
        extraOptions
      );

      console.log("REFRESH RESULT", refreshResult);

      if (refreshResult.data) {
        // Store the new access token
        localStorage.setItem("token", refreshResult.data.bearer.accessToken);
        // Retry the original query with the new token
        return baseQuery(args, api, extraOptions);
      } else {
        // Refresh token failed, logout the user
        api.dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        return result;
      }
    } else {
      // No refresh token, logout the user
      api.dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      return result;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Registration mutation
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      onQueryStarted: async (userData, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Registration response:", data); // Log response to ensure the token is present

          if (data.token) {
            localStorage.setItem("token", data.token); // Store the token in localStorage
            console.log("Token stored:", data.token);
          } else {
            console.error("No token found in response.");
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
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLogoutMutation,
} = apiSlice;
