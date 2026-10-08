import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  loading: false,
};

const slice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
    setLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
  },
});

export const { addMessage, clearMessages, setLoading } = slice.actions;
export default slice.reducer;
