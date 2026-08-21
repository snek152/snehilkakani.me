"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import CursorGlow from "./CursorGlow";
import { CursorFieldProvider } from "./shared/CursorField";
import WaveField from "./shared/WaveField";
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

const NavDirectionContext = createContext<1 | -1 | 0>(0);

export function useNavDirection() {
  return useContext(NavDirectionContext);
}

export const TRANSPORT_CLEARANCE = 64;

function FooterWithClearance() {
  const { activeIndex } = useMusicPlayer();
  return <Footer bottomReserve={activeIndex !== null ? TRANSPORT_CLEARANCE : 0} />;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevIndexRef = useRef<number | null>(null);

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

  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (loaderRecentlySeen()) {
      setIntroReady(true);
    }
  }, []);

  const handleLoaderDone = useCallback(() => {
    stampLoaderSeen();
    setIntroReady(true);
  }, []);

  if (pathname === "/meta-image") {
    return children;
  }

  return (
    <MotionPreferenceProvider>
      <CursorFieldProvider>
        <div className="instrument-chassis relative isolate">
          <a
            href="#main"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-sm focus-visible:border focus-visible:border-accent focus-visible:bg-bg focus-visible:px-3 focus-visible:py-2 focus-visible:text-[length:var(--text-meta)] focus-visible:text-fg"
          >
            Skip to content
          </a>

          <MusicPlayerProvider>
            <WaveField />
            <CursorGlow />
            <ScrollProgressRail />
            <AnimatePresence>
              {!introReady && <LoadingScreen key="loader" onDone={handleLoaderDone} />}
            </AnimatePresence>
            <Sidebar />
            <IntroReadyContext.Provider value={introReady}>
              <NavDirectionContext.Provider value={direction}>
              <div className="relative z-[1] flex min-h-[100dvh] flex-col lg:pl-[52px]">
                <main id="main" className="relative z-[1] flex-1">
                  {children}
                </main>

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
