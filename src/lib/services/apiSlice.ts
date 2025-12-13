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
  Notification,
  CreateNotificationPayload,
} from "../../types";
import type { CONVERSATION, MESSAGE } from "../../types/messenger";
import { handleError } from "../../utils/errorHandling";

const baseUrl = import.meta.env.VITE_API_URL!;

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
  tagTypes: ["Task", "Notification", "Conversation", "Message"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      {
        token: string;
        user: {
          _id: string;
          name: string;
          email: string;
          profilePicture: string;
          role: {
            name: "admin" | "employee";
          };
        };
      },
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
        error ? [] : [{ type: "Task", id: arg.id, res: result }],
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
    getNotifications: builder.query<Notification[], string>({
      query: (userId) => `/notifications/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Notification" as const,
                id: _id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),

    createNotification: builder.mutation<
      Notification,
      CreateNotificationPayload
    >({
      query: (body) => ({
        url: "/notifications",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),

    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) =>
        error ? [] : [{ type: "Notification", id }],
    }),

    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) =>
        error ? [] : [{ type: "Notification", id }],
    }),

    // Messenger endpoints
    createConversation: builder.mutation<
      CONVERSATION,
      { participants: string[] }
    >({
      query: (body) => ({
        url: "/chat/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),
    getConversationsByUser: builder.query<CONVERSATION[], string>({
      query: (userId) => `/chat/conversations/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Conversation" as const,
                id: _id,
              })),
              { type: "Conversation", id: "LIST" },
            ]
          : [{ type: "Conversation", id: "LIST" }],
    }),
    getConversationById: builder.query<CONVERSATION, string>({
      query: (id) => `/chat/conversations/${id}`,
      providesTags: (result, error, id) =>
        error ? [] : [{ type: "Conversation", id }],
    }),
    markConversationAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chat/conversations/${id}/mark-read`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) =>
        error ? [] : [{ type: "Conversation", id }],
    }),
    getUnreadCount: builder.query<number, string>({
      query: (id) => `/chat/conversations/${id}/unread-count`,
    }),
    createMessage: builder.mutation<
      MESSAGE,
      { conversationId: string; content: string }
    >({
      query: (body) => ({
        url: "/chat/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        error
          ? []
          : [
              { type: "Message", id: "LIST" },
              { type: "Conversation", id: arg.conversationId },
            ],
    }),
    getMessages: builder.query<MESSAGE[], string>({
      query: (conversationId) => `/chat/messages/${conversationId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Message" as const,
                id: _id,
              })),
              { type: "Message", id: "LIST" },
            ]
          : [{ type: "Message", id: "LIST" }],
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
  useCreateNotificationMutation,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useCreateConversationMutation,
  useGetConversationsByUserQuery,
  useGetConversationByIdQuery,
  useMarkConversationAsReadMutation,
  useGetUnreadCountQuery,
  useCreateMessageMutation,
  useGetMessagesQuery,
} = apiSlice;
