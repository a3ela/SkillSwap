import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getMatches: builder.query({
      query: () => ({
        url: `${USERS_URL}/matches`,
      }),
      providesTags: ["User"],
    }),
    addSkillToTeach: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/skills/teach`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    addSkillToLearn: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/skills/learn`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    removeSkill: builder.mutation({
      query: ({ type, skillId }) => ({
        url: `${USERS_URL}/skills/${type}/${skillId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetMatchesQuery,
  useAddSkillToTeachMutation,
  useAddSkillToLearnMutation,
  useRemoveSkillMutation,
} = usersApiSlice;
