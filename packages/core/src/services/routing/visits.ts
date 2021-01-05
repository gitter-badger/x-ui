import { warnIf } from '../logging';
import { onChange, state } from './state';
import { storageAvailable } from './utils/browser-utils';

const supportsSession = storageAvailable(window, 'sessionStorage');
warnIf(!supportsSession, 'session-storage is not supported');

const supportsStorage = storageAvailable(window, 'localStorage');
warnIf(!supportsStorage, 'local-storage is not supported');

const visitKey = 'visits';
let memoryState = [];

function parseVisits(visits:string) {
  return JSON.parse(visits || '[]');
}

function stringifyVisits(visits: Array<string>) {
  return JSON.stringify(visits || '[]');
}

export async function getSessionVisits() {
  if (!supportsSession) return memoryState;
  const visits = sessionStorage.getItem(visitKey);
  return parseVisits(visits);
}

export async function setSessionVisits(visits: Array<string>) {
  if (supportsSession) {
    sessionStorage.setItem(visitKey, stringifyVisits(visits));
  } else {
    memoryState = [...new Set([...visits, memoryState])];
  }
}

export async function getStoredVisits() {
  if (!supportsStorage) return memoryState;
  const storage = localStorage.getItem(visitKey);
  return parseVisits(storage);
}

export async function setStoredVisits(visits: Array<string>) {
  if (supportsStorage) {
    localStorage.setItem(visitKey, stringifyVisits(visits));
  } else {
    memoryState = [...new Set([...visits, memoryState])];
  }
}

onChange('storedVisits', async (a) => setStoredVisits(a));
onChange('sessionVisits', async (a) => setSessionVisits(a));

getStoredVisits()
  .then((v) => {
    state.storedVisits = v;
  });

getSessionVisits()
  .then((v) => {
    state.sessionVisits = v;
  });

export function hasVisited(url: string) {
  return state.sessionVisits.includes(url) || state.storedVisits.includes(url);
}

export function markVisit(url: string) {
  state.sessionVisits = [...new Set([...state.sessionVisits, url])];
}

export function storeVisit(url: string) {
  state.storedVisits = [...new Set([...state.storedVisits, url])];
}

export function clearVisits() {
  state.sessionVisits = [];
  state.storedVisits = [];
}
