// src/store/slices/matchesApiSlice.js
import { apiSlice } from "./apiSlice";
import { MATCHES_URL } from "../../constants";

export const matchesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPotentialMatches: builder.query({
      query: () => ({
        url: MATCHES_URL,
      }),
      providesTags: ['Match'],
    }),
    connectWithUser: builder.mutation({
      query: (userId) => ({
        url: `${MATCHES_URL}/${userId}/connect`,
        method: 'POST',
      }),
      invalidatesTags: ['Match'],
    }),
  }),
});

export const {
  useGetPotentialMatchesQuery,
  useConnectWithUserMutation,
} = matchesApiSlice;