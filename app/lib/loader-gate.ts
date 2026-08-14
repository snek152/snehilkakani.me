/**
 * The intro loader shows on a visitor's first arrival and then not again for a
 * day. It is an entrance, and an entrance that plays every single time you
 * open a page stops being an entrance and becomes a toll.
 *
 * Why this needs a pre-paint script and not just an effect: every route is
 * statically prerendered, and `LoadingScreen` is in that HTML — an opaque
 * `fixed inset-0 z-[9999]` layer. The browser paints it before a line of our
 * JavaScript runs, so a returning visitor whose skip is decided in `useEffect`
 * still watches the loader until hydration finishes. The only way to suppress
 * something already in the served markup is to decide before first paint,
 * which is what `LOADER_GATE_SCRIPT` does — the same technique a theme toggle
 * uses to avoid a flash of the wrong colours.
 *
 * The key is the one the pre-redesign site used (`lastVisitTimestamp`), so
 * anybody who visited within the last day is still recognised across the
 * rewrite rather than being shown an intro they already sat through.
 */
export const LOADER_VISIT_KEY = "lastVisitTimestamp";

/** How long a visit suppresses the intro. */
export const LOADER_INTERVAL_MS = 24 * 60 * 60 * 1000;

/** Set by `LOADER_GATE_SCRIPT` before first paint; read by CSS. */
export const LOADER_SEEN_ATTR = "data-loader-seen";

/**
 * Runs in `<head>`, synchronously, before the body paints. Deliberately tiny
 * and dependency-free: it blocks rendering, so it does the minimum — read a
 * timestamp, compare, set one attribute.
 *
 * Interpolates the constants above rather than restating them, so the inline
 * script and the React code below cannot drift into disagreeing about the key
 * or the window. `try` because Safari's private mode throws on `localStorage`
 * access rather than returning null, and a throw in `<head>` would take the
 * whole document down.
 */
export const LOADER_GATE_SCRIPT = `try{var k=${JSON.stringify(LOADER_VISIT_KEY)},w=${LOADER_INTERVAL_MS},l=localStorage.getItem(k);if(l&&Date.now()-Number(l)<w){document.documentElement.setAttribute(${JSON.stringify(LOADER_SEEN_ATTR)},"1")}}catch(e){}`;

/** Client-only. Whether the intro was already seen inside the window. */
export function loaderRecentlySeen(): boolean {
  try {
    const last = window.localStorage.getItem(LOADER_VISIT_KEY);
    return Boolean(last) && Date.now() - Number(last) < LOADER_INTERVAL_MS;
  } catch {
    return false;
  }
}

/**
 * Stamped when the intro actually FINISHES, not when it starts. Someone who
 * closes the tab mid-animation has not seen it, and should not be locked out
 * of it for a day on the strength of a visit they abandoned.
 */
export function stampLoaderSeen(): void {
  try {
    window.localStorage.setItem(LOADER_VISIT_KEY, String(Date.now()));
  } catch {
    /* Private mode, or storage disabled: the intro simply plays every time. */
  }
}
