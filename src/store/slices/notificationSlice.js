import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "notifications",
  initialState: { items: [] },
  reducers: {
    setNotifications(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    markRead(state, action) {
      const item = state.items.find((notification) => notification.$id === action.payload);
      if (item) item.isRead = true;
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const { setNotifications, markRead, clearNotifications } = slice.actions;
export default slice.reducer;
