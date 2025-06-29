"use client";
import { useEffect, useState } from "react";
import HomePage from "./HomePage";
import Navbar from "./Navbar";

export default function LoadingWrapper() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflowY = "auto";
      setLoaded(true);
    }, 3000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar loaded={loaded} />
      <HomePage loaded={loaded} />
    </>
  );
}
