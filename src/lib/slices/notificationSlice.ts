import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "error" | "success" | "warning" | "task" | "info";
  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  items: Notification[];
  showPanel: boolean;
}

const initialState: NotificationState = {
  items: [],
  showPanel: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n._id === action.payload);
      if (notification) {
        notification.status = "read";
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.status = "read";
      });
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n._id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
    togglePanel: (state) => {
      state.showPanel = !state.showPanel;
    },
    closePanel: (state) => {
      state.showPanel = false;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  togglePanel,
  closePanel,
} = notificationSlice.actions;
export default notificationSlice.reducer;
