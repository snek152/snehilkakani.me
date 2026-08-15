export const LOADER_VISIT_KEY = "lastVisitTimestamp";

export const LOADER_INTERVAL_MS = 24 * 60 * 60 * 1000;

export const LOADER_SEEN_ATTR = "data-loader-seen";

export const LOADER_GATE_SCRIPT = `try{var k=${JSON.stringify(LOADER_VISIT_KEY)},w=${LOADER_INTERVAL_MS},l=localStorage.getItem(k);if(l&&Date.now()-Number(l)<w){document.documentElement.setAttribute(${JSON.stringify(LOADER_SEEN_ATTR)},"1")}}catch(e){}`;

export function loaderRecentlySeen(): boolean {
  try {
    const last = window.localStorage.getItem(LOADER_VISIT_KEY);
    return Boolean(last) && Date.now() - Number(last) < LOADER_INTERVAL_MS;
  } catch {
    return false;
  }
}

export function stampLoaderSeen(): void {
  try {
    window.localStorage.setItem(LOADER_VISIT_KEY, String(Date.now()));
  } catch {
  }
}
