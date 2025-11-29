import { apiSlice } from "./apiSlice";

const {SESSIONS_URL} = "../../constants";

export const sessionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    scheduleSession: builder.mutation({
      query: (data) => ({
        url: SESSIONS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Session"], // Invalidate the list when a new one is created
    }),
    getUserSessions: builder.query({
      query: () => SESSIONS_URL,
      providesTags: ["Session"], // Provide this tag for invalidation
    }),
    completeSession: builder.mutation({
      query: (sessionId) => ({
        url: `${SESSIONS_URL}/${sessionId}/complete`,
        method: "PUT",
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const {
  useScheduleSessionMutation,
  useGetUserSessionsQuery,
  useCompleteSessionMutation,
} = sessionApiSlice;
