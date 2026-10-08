import { APPWRITE } from "../appwrite/config";
import { Query, listRows, updateRow } from "../appwrite/database";

export const notificationService = {
  list(userId) {
    return listRows(APPWRITE.tables.notifications, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(20)
    ]);
  },
  markRead(id) {
    return updateRow(APPWRITE.tables.notifications, id, { isRead: true });
  }
};
