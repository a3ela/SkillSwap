// src/store/slices/sessionsApiSlice.js
import { apiSlice } from "./apiSlice";
import { SESSIONS_URL } from "../../constants";

export const sessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserSessions: builder.query({
      query: (type = "all") => ({
        url: `${SESSIONS_URL}?type=${type}`,
      }),
      providesTags: ["Session"],
    }),
    createSession: builder.mutation({
      query: (data) => ({
        url: SESSIONS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Session"],
    }),
    updateSessionStatus: builder.mutation({
      query: ({ sessionId, ...data }) => ({
        url: `${SESSIONS_URL}/${sessionId}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const {
  useGetUserSessionsQuery,
  useCreateSessionMutation,
  useUpdateSessionStatusMutation,
} = sessionsApiSlice;
