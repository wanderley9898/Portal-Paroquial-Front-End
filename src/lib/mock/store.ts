import type {
  AdminUser,
  Broadcast,
  News,
  ParishDocument,
  ParishEvent,
  RadioProgram,
} from "../types";
import { seedNews, seedEvents, seedBroadcasts, seedRadio, seedDocuments, seedUsers } from "./seed";

const PREFIX = "parish-portal:";

type StoreMap = {
  news: News;
  events: ParishEvent;
  broadcasts: Broadcast;
  radio: RadioProgram;
  documents: ParishDocument;
  users: AdminUser;
};

const seeds: { [K in keyof StoreMap]: StoreMap[K][] } = {
  news: seedNews,
  events: seedEvents,
  broadcasts: seedBroadcasts,
  radio: seedRadio,
  documents: seedDocuments,
  users: seedUsers,
};

const memoryStore: Partial<Record<keyof StoreMap, unknown>> = {};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStore<K extends keyof StoreMap>(key: K): StoreMap[K][] {
  const seedList = seeds[key] as StoreMap[K][];
  if (!isBrowser()) {
    return (memoryStore[key] as StoreMap[K][]) ?? [...seedList];
  }
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) {
      const initial = [...seedList];
      window.localStorage.setItem(PREFIX + key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as StoreMap[K][];
  } catch {
    return [...seedList];
  }
}

export function writeStore<K extends keyof StoreMap>(key: K, data: StoreMap[K][]) {
  if (!isBrowser()) {
    memoryStore[key] = data;
    return;
  }
  window.localStorage.setItem(PREFIX + key, JSON.stringify(data));
}

export function resetStore(key?: keyof StoreMap) {
  if (!isBrowser()) return;
  if (key) {
    window.localStorage.removeItem(PREFIX + key);
  } else {
    Object.keys(seeds).forEach((k) => window.localStorage.removeItem(PREFIX + k));
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Convenience CRUD helpers
export function listItems<K extends keyof StoreMap>(key: K): StoreMap[K][] {
  return readStore(key);
}

export function getItem<K extends keyof StoreMap>(key: K, id: string): StoreMap[K] | undefined {
  return readStore(key).find((i) => (i as { id: string }).id === id);
}

export function createItem<K extends keyof StoreMap>(key: K, item: StoreMap[K]) {
  const list = readStore(key);
  list.unshift(item);
  writeStore(key, list);
  return item;
}

export function updateItem<K extends keyof StoreMap>(
  key: K,
  id: string,
  patch: Partial<StoreMap[K]>,
) {
  const list = readStore(key);
  const idx = list.findIndex((i) => (i as { id: string }).id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...patch };
  writeStore(key, list);
  return list[idx];
}

export function removeItem<K extends keyof StoreMap>(key: K, id: string) {
  const list = readStore(key).filter((i) => (i as { id: string }).id !== id);
  writeStore(key, list);
}
