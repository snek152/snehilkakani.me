"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { EASE_OUT, staggerContainer } from "@/app/lib/motion";
import { buildMailtoUrl, CONTACT_EMAIL } from "./mailto";

const fieldMotion: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-[0.3rem] block text-sm font-medium tracking-[0.01em] text-dim"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border-0 border-b border-border bg-transparent py-[0.6rem] text-[0.95rem] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
      />
    </div>
  );
}

export default function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const messageId = useId();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const url = buildMailtoUrl(name, email, message);
    window.setTimeout(() => {
      window.location.href = url;
      setSending(false);
      setSent(true);
    }, reduceMotion ? 0 : 420);
  };

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setSent(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-[0.875rem]"
        role="status"
        aria-live="polite"
      >
        <div className="flex size-9 items-center justify-center border border-border">
          <Check size={15} strokeWidth={2} className="text-accent" />
        </div>
        <p className="text-[0.875rem] text-dim">Opened in your email client.</p>
        <button
          type="button"
          onClick={reset}
          className="self-start border border-border px-[0.875rem] py-[0.45rem] text-sm text-dim transition-colors duration-150 hover:text-fg focus-visible:text-fg focus-visible:outline-none focus-visible:border-accent"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={staggerContainer}
      className="relative flex flex-col gap-[1.875rem]"
      aria-label={`Send a message to ${CONTACT_EMAIL}`}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: sending ? 1 : 0, opacity: sending ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.38, ease: EASE_OUT }}
        className="absolute -bottom-2 left-0 h-px w-full origin-left bg-accent"
      />
      <motion.div variants={fieldMotion}>
        <Field
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Your name"
          autoComplete="name"
        />
      </motion.div>
      <motion.div variants={fieldMotion}>
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@email.com"
          autoComplete="email"
        />
      </motion.div>
      <motion.div variants={fieldMotion}>
        <label
          htmlFor={messageId}
          className="mb-[0.3rem] block text-sm font-medium tracking-[0.01em] text-dim"
        >
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you working on?"
          className="w-full resize-none border-0 border-b border-border bg-transparent py-[0.6rem] text-[0.95rem] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
        />
      </motion.div>
      <motion.button
        variants={fieldMotion}
        type="submit"
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="inline-flex list-none items-center gap-[0.45rem] self-start bg-accent px-[1.375rem] py-[0.7rem] text-[0.875rem] font-medium text-white transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent focus-visible:opacity-80"
      >
        {sending ? "Sending" : "Send"} <ArrowRight size={13} strokeWidth={1.75} />
      </motion.button>
    </motion.form>
  );
}
