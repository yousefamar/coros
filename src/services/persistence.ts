const DB_NAME = "coros-db";
const STORE_NAME = "directory-handles";
const DIRECTORY_KEY = "workspace-directory";

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveDirectoryHandle(
  handle: FileSystemDirectoryHandle
): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.put(handle, DIRECTORY_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function loadDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const handle = await new Promise<FileSystemDirectoryHandle | null>(
      (resolve, reject) => {
        const request = store.get(DIRECTORY_KEY);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      }
    );

    if (!handle) return null;

    const permission = await handle.queryPermission({ mode: "read" });
    if (permission === "granted") {
      return handle;
    }

    const requestPermission = await handle.requestPermission({ mode: "read" });
    if (requestPermission === "granted") {
      return handle;
    }

    return null;
  } catch (error) {
    console.warn("Failed to load directory handle:", error);
    return null;
  }
}

export async function clearDirectoryHandle(): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(DIRECTORY_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
