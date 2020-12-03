import { warnIf } from './logging';
import { storageAvailable } from './utils/dom-utils';

const supportsSession = storageAvailable(window, 'sessionStorage');
warnIf(!supportsSession, 'session-storage is not supported');

const supportsStorage = storageAvailable(window, 'localStorage');
warnIf(!supportsStorage, 'local-storage is not supported');

const visitKey = 'visit';
let memoryState = [];

function parseVisits(visited:string) {
  return JSON.parse(visited || '[]');
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
