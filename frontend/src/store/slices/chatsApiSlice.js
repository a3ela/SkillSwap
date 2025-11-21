// src/store/slices/chatsApiSlice.js
import { apiSlice } from "./apiSlice";
import { CHATS_URL } from "../../constants";

export const chatsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserChats: builder.query({
      query: () => ({
        url: CHATS_URL,
      }),
      providesTags: ["Chat"],
    }),
    getOrCreateChat: builder.mutation({
      query: (data) => ({
        url: CHATS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, ...data }) => ({
        url: `${CHATS_URL}/${chatId}/messages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    getChatMessages: builder.query({
      query: (chatId) => ({
        url: `${CHATS_URL}/${chatId}/messages`,
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useGetOrCreateChatMutation,
  useSendMessageMutation,
  useGetChatMessagesQuery,
} = chatsApiSlice;
