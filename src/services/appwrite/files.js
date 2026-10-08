import { ID } from "appwrite";
import { APPWRITE } from "./config";
import { uploadFile, filePreviewUrl } from "./storage";
import { localDB } from "./localStore";

const TABLE = "flowforge_project_files";
const DB_NAME = "flowforge-file-blobs";
const STORE = "files";

function openBlobDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) return reject(new Error("This browser does not support persistent local file storage. Enable Appwrite Storage or use a modern browser."));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open local file storage."));
  });
}
async function saveBlob(id, file) {
  const db = await openBlobDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(file, id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error || new Error("Could not save file locally.")); };
  });
}
async function readBlob(id) {
  const db = await openBlobDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => { const value = req.result || null; db.close(); resolve(value); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function uploadProjectFile(file, projectId, userId) {
  if (!file) throw new Error("Choose a file first.");
  const id = ID.unique();
  let remote = null;
  if (APPWRITE.dataMode === "appwrite") {
    remote = await uploadFile(file);
  }
  const fileId = remote?.$id || id;
  if (!remote) await saveBlob(fileId, file);
  const row = localDB.create(TABLE, {
    projectId, userId, fileId, remoteId: remote?.$id || null,
    name: file.name, size: file.size, type: file.type || "application/octet-stream",
    url: remote ? filePreviewUrl(remote.$id) : "",
  });
  return row;
}

export async function listProjectFiles(projectId) {
  const rows = localDB.list(TABLE, []).rows.filter((x) => x.projectId === projectId);
  return Promise.all(rows.map(async (row) => {
    if (row.remoteId || APPWRITE.dataMode === "appwrite") {
      try { return { ...row, url: row.remoteId ? filePreviewUrl(row.remoteId) : row.url }; }
      catch { return row; }
    }
    try {
      const blob = await readBlob(row.fileId);
      return { ...row, url: blob ? URL.createObjectURL(blob) : "", unavailable: !blob };
    } catch { return { ...row, unavailable: true }; }
  }));
}
