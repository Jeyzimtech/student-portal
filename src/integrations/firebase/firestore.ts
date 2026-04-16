/**
 * Firestore helper — thin wrapper that provides a Supabase-like API
 * so pages can migrate with minimal code changes.
 */
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, Timestamp, setDoc,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./client";

export type OrderDir = "asc" | "desc";

interface QueryOptions {
  filters?: { field: string; op: "==" | "!=" | "<" | ">" | "<=" | ">="; value: unknown }[];
  orderByField?: string;
  orderDir?: OrderDir;
  limitCount?: number;
}

/** Fetch all docs from a collection with optional filters (3s timeout) */
export async function fetchCollection<T>(collectionName: string, opts?: QueryOptions): Promise<T[]> {
  const constraints: QueryConstraint[] = [];

  if (opts?.filters) {
    for (const f of opts.filters) {
      constraints.push(where(f.field, f.op, f.value));
    }
  }
  if (opts?.orderByField) {
    constraints.push(orderBy(opts.orderByField, opts.orderDir ?? "asc"));
  }
  if (opts?.limitCount) {
    constraints.push(limit(opts.limitCount));
  }

  const q = query(collection(db, collectionName), ...constraints);

  // Race against a 1-second timeout so mock data can kick in very quickly
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Firestore timeout")), 1000)
  );
  const snap = await Promise.race([getDocs(q), timeout]);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

/** Add a document to a collection (auto-ID) */
export async function addDocument<T extends Record<string, unknown>>(collectionName: string, data: T) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    created_at: Timestamp.now(),
  });
  return { id: docRef.id };
}

/** Update a document by ID */
export async function updateDocument(collectionName: string, docId: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, collectionName, docId), data);
}

/** Delete a document by ID */
export async function deleteDocument(collectionName: string, docId: string) {
  await deleteDoc(doc(db, collectionName, docId));
}

/** Get a single document by ID */
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, docId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

/** Count docs in a collection (with optional filters) */
export async function countCollection(collectionName: string, opts?: QueryOptions): Promise<number> {
  const docs = await fetchCollection(collectionName, opts);
  return docs.length;
}

export { collection, doc, db, Timestamp, setDoc };
