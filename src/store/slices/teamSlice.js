import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "team",
  initialState: { members: [] },
  reducers: {
    setMembers(state, action) {
      state.members = Array.isArray(action.payload) ? action.payload : [];
    },
    addMember(state, action) {
      state.members.push(action.payload);
    },
    removeMember(state, action) {
      state.members = state.members.filter((member) => member.$id !== action.payload);
    },
  },
});

export const { setMembers, addMember, removeMember } = slice.actions;
export default slice.reducer;
