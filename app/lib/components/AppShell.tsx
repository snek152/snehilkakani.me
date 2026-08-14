"use client";

/**
 * useIntroReady()
 * ----------------
 * Reactive signal for whether the intro curtain is out of the way: false
 * while the LoadingScreen is active, true once it either completes (the
 * curtain-lift callback fires) or is skipped entirely because this browser
 * session already saw it (per sessionStorage). Page components (namely
 * Home) should consume this value REACTIVELY — e.g.
 * `animate={introReady ? "visible" : "hidden"}` — rather than capturing it
 * once on mount, since children render immediately (underneath the curtain)
 * and the value flips live when the curtain lifts.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import CursorGlow from "./CursorGlow";
import { CursorFieldProvider } from "./shared/CursorField";
import WaveField, { sceneFromPathname } from "./shared/WaveField";
import LoadingScreen from "./LoadingScreen";
import { MotionPreferenceProvider } from "./shared/MotionPreference";
import ScrollProgressRail from "./shared/ScrollProgressRail";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { MusicPlayerProvider, useMusicPlayer } from "./music/MusicPlayerProvider";
import { navItems } from "@/app/lib/nav";
import { loaderRecentlySeen, stampLoaderSeen } from "@/app/lib/loader-gate";


const IntroReadyContext = createContext(false);

export function useIntroReady() {
  return useContext(IntroReadyContext);
}

/**
 * useNavDirection()
 * ------------------
 * 1 when the most recent route change moved forward through `navItems`
 * (e.g. Home -> Work), -1 when it moved backward, 0 on initial load or
 * when either route isn't a top-level nav item.
 */
const NavDirectionContext = createContext<1 | -1 | 0>(0);

export function useNavDirection() {
  return useContext(NavDirectionContext);
}

/**
 * Height, in pixels, of the fixed music transport (`PlayerBar` pins
 * itself to exactly this). The shell hands it to `Footer` as bottom
 * padding while a track is loaded, so the bar's footprint is part of the
 * footer's own surface: maximum scroll then ends on the footer's
 * background instead of in a band of empty space below it, and the
 * footer's links still scroll clear of the bar.
 */
export const TRANSPORT_CLEARANCE = 64;

/**
 * Renders `Footer`, reserving `TRANSPORT_CLEARANCE` inside its own
 * surface whenever the shared transport has a track loaded — derived
 * straight from `useMusicPlayer()` rather than a page telling the shell
 * about it, since the transport is now shell-owned and can be active on
 * any route, not just /music.
 */
function FooterWithClearance() {
  const { activeIndex } = useMusicPlayer();
  return <Footer bottomReserve={activeIndex !== null ? TRANSPORT_CLEARANCE : 0} />;
}


export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scene = sceneFromPathname(pathname);
  const prevIndexRef = useRef<number | null>(null);

  // Computed synchronously during render (not in an effect) so the new
  // direction is already in context by the time the incoming route's
  // `template.tsx` mounts and reads its `initial` position — an effect
  // would fire a commit too late, leaving Template stuck on the
  // previous navigation's direction. The ref is advanced in an effect
  // below, i.e. read-then-update: this render reads the OLD ref value,
  // then the effect updates it for the NEXT navigation.
  const currentIndex = navItems.findIndex((item) =>
    item.end ? pathname === item.href : pathname.startsWith(item.href)
  );
  const prevIndex = prevIndexRef.current;
  const direction: 1 | -1 | 0 =
    currentIndex === -1 || prevIndex === null || prevIndex === -1 || currentIndex === prevIndex
      ? 0
      : currentIndex > prevIndex
        ? 1
        : -1;

  useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [pathname, currentIndex]);

  /* The intro plays once a day, not once a navigation. The pre-paint script in
   * `app/layout.tsx` has already hidden the prerendered overlay for a
   * returning visitor; this unmounts that hidden node and, more importantly,
   * releases `introReady` so the hero's own entrance is not gated behind an
   * intro that is never going to finish. */
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (loaderRecentlySeen()) setIntroReady(true);
  }, []);

  const handleLoaderDone = useCallback(() => {
    // Stamped on completion, not on arrival — see `stampLoaderSeen`.
    stampLoaderSeen();
    setIntroReady(true);
  }, []);

  return (
    <MotionPreferenceProvider>
      <CursorFieldProvider>
        <div className="instrument-chassis relative isolate" data-field-scene={scene}>
          {/* First focusable element on every route, so a keyboard or screen
            * reader visitor can bypass the five nav items instead of tabbing
            * the same block on each navigation (WCAG 2.4.1). Invisible until
            * focused: it is an affordance for the people who need it, not
            * chrome for everyone else. Sits above the rail's `z-50` but below
            * the loader's `z-[9999]`. */}
          <a
            href="#main"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-sm focus-visible:border focus-visible:border-accent focus-visible:bg-bg focus-visible:px-3 focus-visible:py-2 focus-visible:text-[length:var(--text-meta)] focus-visible:text-fg"
          >
            Skip to content
          </a>
          {/* The shell owns `MusicPlayerProvider` so its persistent transport
            * remains available across route navigation. */}
          <MusicPlayerProvider>
            <WaveField scene={scene} />
            <CursorGlow />
            <ScrollProgressRail />
            <AnimatePresence>
              {!introReady && <LoadingScreen key="loader" onDone={handleLoaderDone} />}
            </AnimatePresence>
            <Sidebar />
            <IntroReadyContext.Provider value={introReady}>
              <NavDirectionContext.Provider value={direction}>
              {/* `relative z-[1]` sits on the whole column, not just the
                * content div: `WaveField` is fixed at `z-0`, and a
                * positioned element paints above unpositioned content, so
                * with only the inner div lifted the Footer below it was
                * being painted over. */}
              <div className="relative z-[1] flex min-h-[100dvh] flex-col lg:pl-[52px]">
                <main id="main" className="relative z-[1] flex-1">
                  {children}
                </main>
                {/* The transport's footprint is reserved INSIDE the
                  * footer (see `TRANSPORT_CLEARANCE`), not by a spacer
                  * after it — a sibling spacer left the document taller
                  * than the footer, so max scroll ended below it. */}
                <FooterWithClearance />
              </div>
              </NavDirectionContext.Provider>
            </IntroReadyContext.Provider>
          </MusicPlayerProvider>
        </div>
      </CursorFieldProvider>
    </MotionPreferenceProvider>
  );
}
