import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
  },
});

export const { toggleSidebar, closeSidebar, openSidebar } = slice.actions;
export default slice.reducer;
