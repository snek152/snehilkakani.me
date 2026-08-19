"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { EASE_OUT, staggerContainer } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyylnqbg";

const fieldMotion: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: beats(0.6), ease: EASE_OUT },
  },
};

const EASE_PRESS = [0.23, 1, 0.32, 1] as const;

function Field({
  id,
  label,
  type,
  value,
  onChange,
  onBlurValidate,
  placeholder,
  autoComplete,
  error,
  inputRef,
}: {
  id: string;
  label: string;
  type: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  onBlurValidate?: () => void;
  placeholder: string;
  autoComplete: string;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-[0.3rem] block text-[length:var(--text-meta)] font-medium tracking-[var(--track-text-sm)] text-dim"
      >
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={type}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlurValidate}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full border-0 border-b border-border bg-transparent py-[0.6rem] text-[length:var(--text-body)] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
        />
      </div>

      {error && (
        <p
          id={errorId}
          className="mt-[0.4rem] text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-fg"
        >
          {error}
        </p>
      )}
    </div>
  );
}

type FieldErrors = { name?: string; email?: string; message?: string };

function emailProblem(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Add an email address.";
  if (/\s/.test(value)) return "Not a valid email address.";
  if (!value.includes("@")) return "Not a valid email address.";
  const [local, ...rest] = value.split("@");
  const domain = rest.join("@");
  if (!local) return "Not a valid email address.";
  if (!domain) return "Not a valid email address";
  if (!domain.includes(".")) return "Not a valid email address.";
  if (domain.startsWith(".") || domain.endsWith("."))
    return "Not a valid email address.";
  return undefined;
}

export default function ContactForm() {
  const reduceMotion = useMotionPreference();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const messageId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const statusRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  useEffect(() => {
    if (!sent && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      nameInputRef.current?.focus();
    }
  }, [sent]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, []);

  const clearError = (key: keyof FieldErrors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const validateOnBlur = (key: keyof FieldErrors, value: string) => {
    if (!value.trim()) return;
    const problem = key === "email" ? emailProblem(value) : undefined;
    setErrors((prev) => ({ ...prev, [key]: problem }));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found: FieldErrors = {
      name: name.trim() ? undefined : "Add your name.",
      email: emailProblem(email),
      message: message.trim() ? undefined : "Add the message you want to send.",
    };
    const firstBad = (["name", "email", "message"] as const).find(
      (key) => found[key],
    );

    if (firstBad) {
      setErrors(found);
      document
        .getElementById(firstBad === "message" ? messageId : firstBad)
        ?.focus();
      return;
    }

    setErrors({});
    setSubmissionError(null);
    setSending(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    fetch(FORMSPREE_ENDPOINT, {
      headers: {
        "Content-Type": "application/json",
        "Data-Type": "json",
      },
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ name, email, message }),
      signal: controller.signal,
    })
      .then(() => {
        clearTimeout(timeoutId);
        if (abortControllerRef.current !== controller) return;
        abortControllerRef.current = null;
        setSending(false);
        setName("");
        setEmail("");
        setMessage("");
        setSent(true);
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (abortControllerRef.current !== controller) return;
        abortControllerRef.current = null;
        setSubmissionError("Failed to send message. Please try again later.");
        setSending(false);
      });
  };

  const reset = () => {
    restoreFocusRef.current = true;
    setSent(false);
    setSubmissionError(null);
    setErrors({});
  };

  if (sent) {
    return (
      <motion.div
        ref={statusRef}
        tabIndex={-1}
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-[0.875rem] outline-none"
        role="status"
        aria-live="polite"
      >
        <div className="flex size-9 items-center justify-center border border-border">
          <Check size={15} strokeWidth={2} className="text-accent" />
        </div>
        <p className="max-w-[var(--measure-body)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-dim">
          Thanks for reaching out! I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={reset}
          className="self-start border border-border px-[0.875rem] py-[0.45rem] text-[length:var(--text-meta)] text-dim transition-colors duration-[120ms] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={staggerContainer}
      className="relative flex flex-col gap-[1.875rem]"
      aria-label="Send a message"
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: sending ? 1 : 0, opacity: sending ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : beats(0.6), ease: EASE_OUT }}
        className="absolute -bottom-2 left-0 h-px w-full origin-left bg-accent"
      />
      <motion.div variants={fieldMotion}>
        <Field
          id="name"
          inputRef={nameInputRef}
          label="Name"
          type="text"
          value={name}
          onChange={(v) => {
            setName(v);
            clearError("name");
          }}
          placeholder="Your name"
          autoComplete="name"
          onBlurValidate={() => validateOnBlur("name", name)}
          error={errors.name}
        />
      </motion.div>
      <motion.div variants={fieldMotion}>
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            clearError("email");
          }}
          placeholder="your@email.com"
          autoComplete="email"
          onBlurValidate={() => validateOnBlur("email", email)}
          error={errors.email}
        />
      </motion.div>
      <motion.div variants={fieldMotion}>
        <label
          htmlFor={messageId}
          className="mb-[0.3rem] block text-[length:var(--text-meta)] font-medium tracking-[var(--track-text-sm)] text-dim"
        >
          Message
        </label>
        <div className="relative">
          <textarea
            id={messageId}
            name="message"
            required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              clearError("message");
            }}
            onBlur={() => validateOnBlur("message", message)}
            placeholder="What are you working on?"
            className="w-full resize-none border-0 border-b border-border bg-transparent py-[0.6rem] text-[length:var(--text-body)] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
          />
        </div>
        {errors.message && (
          <p
            id={`${messageId}-error`}
            className="mt-[0.4rem] text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-fg"
          >
            {errors.message}
          </p>
        )}
      </motion.div>
      <motion.button
        type="submit"
        disabled={sending}
        whileHover={reduceMotion || sending ? undefined : { scale: 1.03 }}
        whileTap={
          sending
            ? undefined
            : reduceMotion
              ? { opacity: 0.7 }
              : { scale: 0.97 }
        }
        transition={{ duration: 0.12, ease: EASE_PRESS }}
        className="inline-flex list-none items-center gap-[0.45rem] self-start bg-accent px-[1.375rem] py-[0.7rem] text-[length:var(--text-meta)] font-medium text-white transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent focus-visible:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Sending" : "Send message"}{" "}
        <ArrowRight size={13} strokeWidth={1.75} />
      </motion.button>
      {submissionError && (
        <p
          role="alert"
          className="text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-fg"
        >
          {submissionError}
        </p>
      )}
    </motion.form>
  );
}
