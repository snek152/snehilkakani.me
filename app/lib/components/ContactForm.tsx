"use client";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <motion.div
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
      className="w-full rounded-xl bg-secondary/40 backdrop-blur-xl p-6 border-2 border-primary/10 relative overflow-hidden"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          delay: 0.05,
          duration: 0.28,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="text-2xl font-medium font-domine text-center text-white"
      >
        Interested in collaborating?
      </motion.h3>
      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) {
            setError("Please enter your name.");
            return;
          }
          if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email address.");
            return;
          }
          if (!message.trim()) {
            setError("Please enter a message.");
            return;
          }
          setError("");
          setLoading(true);
          // Simulate a network request
          fetch("https://formspree.io/f/xyylnqbg", {
            headers: {
              "Content-Type": "application/json",
              "Data-Type": "json",
            },
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({ name, email, message }),
          })
            .then((res) => {
              console.log(res);
              // if (res.status !== 200 && res.status !== 302) {
              //   setError("Failed to send message. Please try again.");
              //   setLoading(false);
              //   return;
              // }
              setLoading(false);
              setName("");
              setEmail("");
              setMessage("");
              setSubmitted(true);
            })
            .catch(() => {
              setError("Failed to send message. Please try again later.");
              setLoading(false);
              return;
            });
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{
            delay: 0.15,
            duration: 0.22,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-col gap-2"
        >
          <input
            id="name"
            // type="text"
            className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder:text-white/50 placeholder:font-ibm focus:outline-none focus:ring-2 focus:ring-primary/60 transition backdrop-blur-md shadow-sm"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            // required
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{
            delay: 0.18,
            duration: 0.22,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-col gap-2"
        >
          <input
            id="email"
            // type="email"
            className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder:text-white/50 placeholder:font-ibm focus:outline-none focus:ring-2 focus:ring-primary/60 transition backdrop-blur-md shadow-sm"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            // required
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{
            delay: 0.21,
            duration: 0.22,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-col gap-2"
        >
          <textarea
            id="message"
            className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder:text-white/50 placeholder:font-ibm focus:outline-none focus:ring-2 focus:ring-primary/60 transition backdrop-blur-md shadow-sm"
            placeholder="How can I help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // required
          />
        </motion.div>
        <div style={{ minHeight: "1.25rem" }}>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-red-400 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
          {!error && submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-primary text-sm font-medium"
            >
              Thanks for reaching out! I{"'"}ll get back to you soon.
            </motion.div>
          )}
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            delay: 0.25,
            duration: 0.18,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          type="submit"
          className={`inline-flex font-ibm items-center justify-center gap-2 rounded-lg px-6 py-2 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all duration-200 
            ${
              loading || submitted
                ? "opacity-70 bg-on-surface cursor-not-allowed"
                : "cursor-pointer bg-gradient-to-r from-primary/80 via-primary to-primary/90 scale-100 hover:scale-105 hover:bg-primary/95 active:scale-105 active:bg-primary/95 shadow-lg shadow-primary/20"
            }`}
          disabled={loading || submitted}
        >
          <AnimatePresence>
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div
                  className={`flex items-center justify-center w-full h-full`}
                >
                  <svg
                    className="text-transparent animate-spin"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="27"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M32 5a27 27 0 0 1 0 54"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-surface"
                    />
                  </svg>
                </div>
              </motion.span>
            ) : submitted ? (
              <motion.span
                key="submitted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Sent!
              </motion.span>
            ) : (
              <span key="send">Send Message</span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
      {/* <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: 0.25, duration: 0.18 }}
                    className="mt-4"
                  >
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-primary/80 px-4 py-2 text-base font-semibold text-white shadow-inner shadow-primary/10 focus:outline-none hover:bg-primary transition-colors"
                      onClick={close}
                    >
                      Got it, thanks!
                    </Button>
                  </motion.div> */}
    </motion.div>
  );
}
