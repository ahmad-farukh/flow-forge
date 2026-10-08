import { Permission, Role } from "appwrite";

export const userPermissions = (userId, { read = true, write = true, remove = true } = {}) => {
  const p = [];
  if (read) p.push(Permission.read(Role.user(userId)));
  if (write) p.push(Permission.update(Role.user(userId)));
  if (remove) p.push(Permission.delete(Role.user(userId)));
  return p;
};

export const memberReadPermissions = (userIds = []) =>
  [...new Set(userIds.filter(Boolean))].map((id) => Permission.read(Role.user(id)));
