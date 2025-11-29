import { apiSlice } from "./apiSlice";
import { CONNECTIONS_URL } from "../../constants";

export const connectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyConnections: builder.query({
      query: () => `${CONNECTIONS_URL}`,
      providesTags: ["Connection"],
    }),
    sendConnectionRequest: builder.mutation({
      query: (userId) => ({
        url: `${CONNECTIONS_URL}/request/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Connection", "User"],
    }),
    respondToRequest: builder.mutation({
      query: ({ id, status }) => ({
        url: `${CONNECTIONS_URL}/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Connection", "User"],
    }),
  }),
});

export const {
  useGetMyConnectionsQuery,
  useSendConnectionRequestMutation,
  useRespondToRequestMutation,
} = connectionsApiSlice;
