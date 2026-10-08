import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({ name: "tasks", initialState: { items: [], selected: null }, reducers: {
  setTasks: (s, a) => { s.items = a.payload; },
  setSelectedTask: (s, a) => { s.selected = a.payload; },
  upsertTask: (s, a) => { const i = s.items.findIndex(x => x.$id === a.payload.$id); i >= 0 ? s.items[i] = a.payload : s.items.push(a.payload); },
  removeTask: (s, a) => { s.items = s.items.filter(x => x.$id !== a.payload); }
}});
export const { setTasks, setSelectedTask, upsertTask, removeTask } = slice.actions;
export default slice.reducer;
