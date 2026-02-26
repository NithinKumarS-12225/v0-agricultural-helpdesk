export interface Query {
  id?: number;
  prompt: string;
  type: 'text' | 'voice';
  status: 'pending' | 'completed';
  createdAt: number;
}

export interface Response {
  id?: number;
  queryId: number;
  response: string;
  createdAt: number;
}

const DB_NAME = 'kisan-ai-db';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains('queries')) {
        database.createObjectStore('queries', { keyPath: 'id', autoIncrement: true });
      }

      if (!database.objectStoreNames.contains('responses')) {
        database.createObjectStore('responses', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const saveQuery = async (query: Omit<Query, 'id'>): Promise<number> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('queries', 'readwrite');
    const store = transaction.objectStore('queries');
    const request = store.add(query);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

export const saveResponse = async (response: Omit<Response, 'id'>): Promise<number> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('responses', 'readwrite');
    const store = transaction.objectStore('responses');
    const request = store.add(response);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

export const getPendingQueries = async (): Promise<Query[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('queries', 'readonly');
    const store = transaction.objectStore('queries');
    const request = store.getAll();

    request.onsuccess = () => {
      const queries = (request.result as Query[]).filter((q) => q.status === 'pending');
      resolve(queries);
    };

    request.onerror = () => reject(request.error);
  });
};

export const updateQueryStatus = async (id: number, status: 'pending' | 'completed'): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('queries', 'readwrite');
    const store = transaction.objectStore('queries');
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const query = getRequest.result as Query;
      query.status = status;
      const updateRequest = store.put(query);

      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const getResponsesByQueryId = async (queryId: number): Promise<Response[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('responses', 'readonly');
    const store = transaction.objectStore('responses');
    const request = store.getAll();

    request.onsuccess = () => {
      const responses = (request.result as Response[]).filter((r) => r.queryId === queryId);
      resolve(responses);
    };

    request.onerror = () => reject(request.error);
  });
};
