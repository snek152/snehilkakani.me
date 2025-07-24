"use client";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
// import Card from "./Card";

export default function ContactModal({
  hovered,
  setHovered,
}: {
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setHovered(false);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        onClick={open}
        className="relative flex lg:flex-row flex-col lg:items-center lg:h-9 lg:w-full w-9 h-full transition-all duration-300 overflow-hidden text-surface focus:outline-none cursor-pointer hover:text-primary"
        style={{ minWidth: 0 }}
      >
        <span className="absolute left-0 top-0 lg:h-full lg:w-14 w-full h-14 flex items-center justify-center pointer-events-none">
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ position: "relative" }}
          >
            <span
              //   key="active"
              //   initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
              //   animate={{ opacity: 1, scale: 1, rotate: 0 }}
              //   exit={{ opacity: 0, scale: 1, rotate: 0 }}
              //   transition={{
              //     type: "spring",
              //     stiffness: 300,
              //     damping: 24,
              //   }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <AtSymbolIcon className="w-9 h-9" />
            </span>
          </div>
        </span>
        <span className="lg:w-22 w-0" />

        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ width: "100%", opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="whitespace-nowrap lg:visible invisible overflow-hidden text-lg text-left font-ibm font-medium inline-block"
            >
              Contact
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <Dialog
            static
            open={isOpen}
            className="relative z-50 focus:outline-none"
            onClose={close}
          >
            <DialogBackdrop
              as={motion.div}
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              //   transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/20"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  as={motion.div}
                  initial={{
                    scale: 0.97,
                    opacity: 0,
                    y: 24,
                    boxShadow: "0 0px 0px 0 rgba(13,110,253,0)",
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    boxShadow: "0 8px 32px 0 rgba(13,110,253,0.13)",
                    transition: {
                      type: "spring",
                      stiffness: 220,
                      damping: 26,
                      mass: 0.8,
                      opacity: { duration: 0.18 },
                      boxShadow: { duration: 0.22 },
                    },
                  }}
                  exit={{
                    scale: 0.98,
                    opacity: 0,
                    y: 16,
                    boxShadow: "0 0px 0px 0 rgba(13,110,253,0)",
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 32,
                      mass: 0.8,
                      opacity: { duration: 0.13 },
                      boxShadow: { duration: 0.18 },
                    },
                  }}
                  style={{
                    boxShadow: "0 8px 32px 0 rgba(13, 110, 253, 0.13)",
                  }}
                  className="w-full max-w-md rounded-xl bg-surface/5 p-6 backdrop-blur-xl border border-primary/10 relative overflow-hidden"
                >
                  <DialogTitle
                    as={motion.h3}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      delay: 0.05,
                      duration: 0.28,
                      ease: "easeOut",
                    }}
                    className="text-2xl font-medium font-domine text-center text-white"
                  >
                    Contact Me
                  </DialogTitle>
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ delay: 0.15, duration: 0.22 }}
                    className="mt-2 text-sm/6 text-white/60"
                  >
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: 0.25, duration: 0.18 }}
                    className="mt-4"
                  >
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600 transition-colors"
                      onClick={close}
                    >
                      Got it, thanks!
                    </Button>
                  </motion.div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
