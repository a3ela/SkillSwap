import { apiSlice } from "./apiSlice";
import { CHATS_URL } from "../../constants";
export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (userId) => `${CHATS_URL}/${userId}`,
      providesTags: ["Chat"],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = chatApiSlice;
