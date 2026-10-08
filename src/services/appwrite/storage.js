import { ID } from "appwrite";
import { storage } from "../../components/service/appwrite/conf";
import { APPWRITE } from "./config";

function assertBucket() {
  if (!APPWRITE.bucketId) throw new Error("VITE_APPWRITE_BUCKET_ID is missing.");
}

export function uploadFile(file, permissions) {
  assertBucket();
  return storage.createFile({
    bucketId: APPWRITE.bucketId,
    fileId: ID.unique(),
    file,
    ...(Array.isArray(permissions) && permissions.length ? { permissions } : {}),
  });
}

export function deleteFile(fileId) {
  assertBucket();
  return storage.deleteFile({ bucketId: APPWRITE.bucketId, fileId });
}

export function filePreviewUrl(fileId) {
  assertBucket();
  return storage.getFileView({ bucketId: APPWRITE.bucketId, fileId }).toString();
}
