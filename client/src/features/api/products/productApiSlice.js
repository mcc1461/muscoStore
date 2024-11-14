// src/features/api/products/productApiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setToken } from "../../auth/authSlice";

const productBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const productBaseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await productBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !args._retry) {
    args._retry = true;
    console.warn("Product API received 401, attempting token refresh");

    const refreshResult = await productBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken: api.getState().auth.refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = refreshResult.data.token;
      const newRefreshToken = refreshResult.data.refreshToken;

      api.dispatch(
        setToken({ token: newToken, refreshToken: newRefreshToken })
      );

      result = await productBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      // Navigate işlemini komponentlerde yapın
    }
  }

  return result;
};

export const productApiSlice = createApi({
  reducerPath: "productApi",
  baseQuery: productBaseQueryWithReauth,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    // Diğer ürünle ilgili endpoint'ler...
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
