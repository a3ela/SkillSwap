import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../../constants";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `${AUTH_URL}/verify-email`,
        method: "POST",
        body: { token },
      }),
      invalidatesTags: ["Auth"],
    }),
    resendVerification: builder.mutation({
      query: (email) => ({
        url: `${AUTH_URL}/resend-verification`,
        method: "POST",
        body: { email },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
