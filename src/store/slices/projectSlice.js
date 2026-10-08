import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({ name: "projects", initialState: { items: [], selected: null }, reducers: {
  setProjects: (s, a) => { s.items = a.payload; },
  setSelectedProject: (s, a) => { s.selected = a.payload; },
  upsertProject: (s, a) => { const i = s.items.findIndex(x => x.$id === a.payload.$id); i >= 0 ? s.items[i] = a.payload : s.items.unshift(a.payload); },
  removeProject: (s, a) => { s.items = s.items.filter(x => x.$id !== a.payload); }
}});
export const { setProjects, setSelectedProject, upsertProject, removeProject } = slice.actions;
export default slice.reducer;
