"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type NavContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavContextProvider");
  }
  return context;
};

type NavContextProviderProps = {
  children: ReactNode;
};

export const NavContextProvider: React.FC<NavContextProviderProps> = ({
  children,
}) => {
  const [activeSection, setActiveSection] = useState<string>("home");

  return (
    <NavContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavContext.Provider>
  );
};
