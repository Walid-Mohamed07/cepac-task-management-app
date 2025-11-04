import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "../slices/authSlice";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  CreateSubTaskPayload,
  UpdateSubTaskPayload,
} from "../../types";
import { handleError } from "../../utils/errorHandling";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Dispatch logout action to clear user credentials and localStorage
    api.dispatch(logout());
    // Force a redirect to the login page
    window.location.href = "/login";
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { token: string; user: any },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    //  Users endpoint
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),

    // Task endpoints
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: (result: Task[] | undefined) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Task" as const, id: _id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    createTask: builder.mutation<void, CreateTaskPayload>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body: body,
      }),
      transformErrorResponse: (response) =>
        handleError(response, "Failed to add new task"),
      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation<void, UpdateTaskPayload>({
      query: (body) => {
        const { id, ...payload } = body;

        return {
          url: `/tasks/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
      transformErrorResponse: (response) =>
        handleError(response, "Failed to update blog"),
      invalidatesTags: (result, error, arg) =>
        error ? [] : [{ type: "Task", id: arg.id }],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) =>
        handleError(response, "Failed to delete task"),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    getAssignedTasks: builder.query({
      query: (userId: string) => `/user-tasks/user/${userId}`,
    }),

    getAllSubTasks: builder.query({
      query: () => ({
        url: "/user-tasks",
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    getSubTasks: builder.query({
      query: (taskId: string) => `/user-tasks?taskId=${taskId}`,
    }),

    createSubTask: builder.mutation<void, CreateSubTaskPayload>({
      query: (body) => ({
        url: "/user-tasks",
        method: "POST",
        body: body,
      }),
      transformErrorResponse: (response) =>
        handleError(response, "Failed to assign user to task"),
      invalidatesTags: ["Task"],
    }),

    updateSubTask: builder.mutation<void, UpdateSubTaskPayload>({
      query: (body) => {
        const { id, ...payload } = body;
        return {
          url: `/user-tasks/${id}`,
          method: "PATCH",
          body: payload, // title, description, status, deadTime
        };
      },
      transformErrorResponse: (response) =>
        handleError(response, "Failed to update subtask"),
      invalidatesTags: ["Task"],
    }),

    deleteSubTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user-tasks/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) =>
        handleError(response, "Failed to delete subtask"),
      invalidatesTags: ["Task"],
    }),
    // Notification endpoints
    getNotifications: builder.query({
      query: () => "/notifications",
      pollingInterval: 30000, // Poll every 30 seconds
    }),

    markNotificationAsRead: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
    }),

    deleteNotification: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAllUsersQuery,
  useGetTasksQuery,
  useGetAssignedTasksQuery,
  useGetAllSubTasksQuery,
  useGetSubTasksQuery,
  useGetNotificationsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateSubTaskMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = apiSlice;
