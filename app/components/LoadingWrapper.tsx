"use client";
import { useEffect, useState } from "react";
import HomePage from "./HomePage";
import Navbar from "./Navbar";

const VISIT_KEY = "lastVisitTimestamp";
const HOURS_24 = 24 * 60 * 60 * 1000;

export default function LoadingWrapper() {
  const [loaded, setLoaded] = useState(false);
  const [needsToLoad, setNeedsToLoad] = useState(true);

  useEffect(() => {
    const lastVisit = localStorage.getItem(VISIT_KEY);
    const now = Date.now();
    if (lastVisit && now - Number(lastVisit) < HOURS_24) {
      setNeedsToLoad(false);
    } else {
      setNeedsToLoad(true);
      localStorage.setItem(VISIT_KEY, String(now));
    }
  }, []);

  useEffect(() => {
    if (!needsToLoad) {
      setLoaded(true);
      return;
    }
    document.body.style.overflowY = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflowY = "auto";
      setLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [needsToLoad]);

  return (
    <>
      <Navbar loaded={loaded} />
      <HomePage loaded={loaded} />
    </>
  );
}
