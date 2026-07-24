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
import FilmGrain from "./shared/FilmGrain";
import LoadingScreen from "./LoadingScreen";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { navItems } from "@/app/lib/nav";


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

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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

  const isLoaderPreview = pathname.startsWith("/loader-");
  const [introReady, setIntroReady] = useState(isLoaderPreview);

  const handleLoaderDone = useCallback(() => {
    setIntroReady(true);
  }, []);

  return (
    <div className="relative">
      <FilmGrain />
      <CursorGlow />
      <AnimatePresence>
        {!introReady && <LoadingScreen key="loader" onDone={handleLoaderDone} />}
      </AnimatePresence>
      <Sidebar />
      <IntroReadyContext.Provider value={introReady}>
        <NavDirectionContext.Provider value={direction}>
          <div className="flex min-h-[100dvh] flex-col lg:pl-[52px]">
            <div className="relative z-[1] flex-1">{children}</div>
            <Footer />
          </div>
        </NavDirectionContext.Provider>
      </IntroReadyContext.Provider>
    </div>
  );
}
