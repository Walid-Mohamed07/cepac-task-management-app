import { createSlice } from "@reduxjs/toolkit";

interface NotificationState {
  showPanel: boolean;
}

const initialState: NotificationState = {
  showPanel: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    togglePanel: (state) => {
      state.showPanel = !state.showPanel;
    },
    closePanel: (state) => {
      state.showPanel = false;
    },
  },
});

export const { togglePanel, closePanel } = notificationSlice.actions;
export default notificationSlice.reducer;

