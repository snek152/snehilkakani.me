"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { AlertTriangle, ArrowRight, Check, Mail } from "lucide-react";
import { EASE_OUT, staggerContainer } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { BORDERED_CONTROL } from "@/app/lib/components/shared/controls";
import { buildMailtoUrl, CONTACT_EMAIL, MAILTO_MAX_SAFE_LENGTH } from "./mailto";

const fieldMotion: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: beats(0.6), ease: EASE_OUT } },
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
  reduceMotion,
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
  reduceMotion: boolean;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [focused, setFocused] = useState(false);
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
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlurValidate?.();
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full border-0 border-b border-border bg-transparent py-[0.6rem] text-[length:var(--text-body)] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[image:var(--seam-focus)]"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : beats(0.4), ease: EASE_OUT }}
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
  if (!value) return "Add an email address — there's no way to reply without one.";
  if (/\s/.test(value)) return "An email address can't contain a space — remove it and try again.";
  if (!value.includes("@")) return "This is missing an @. An address looks like you@example.com.";
  const [local, ...rest] = value.split("@");
  const domain = rest.join("@");
  if (!local) return "There's nothing before the @ — add the first part, like you@example.com.";
  if (!domain) return "There's nothing after the @ — add the domain, like example.com.";
  if (!domain.includes(".")) return "The part after the @ needs a dot in it, like example.com.";
  if (domain.startsWith(".") || domain.endsWith(".")) return "The domain has a stray dot at one end — check it and try again.";
  return undefined;
}

export default function ContactForm() {
  const reduceMotion = useMotionPreference();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const [delivered, setDelivered] = useState(false);
  const [failed, setFailed] = useState(false);

  const [tooLong, setTooLong] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  const messageId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const statusRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  useEffect(() => {
    if (!sent && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      nameInputRef.current?.focus();
    }
  }, [sent]);

  const clearError = (key: keyof FieldErrors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const validateOnBlur = (key: keyof FieldErrors, value: string) => {
    if (!value.trim()) return;
    const problem = key === "email" ? emailProblem(value) : undefined;
    setErrors((prev) => ({ ...prev, [key]: problem }));
  };

  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found: FieldErrors = {
      name: name.trim() ? undefined : "Add your name, so a reply knows who it's answering.",
      email: emailProblem(email),
      message: message.trim() ? undefined : "Add the message you want to send.",
    };
    const firstBad = (["name", "email", "message"] as const).find((key) => found[key]);

    if (firstBad) {
      setErrors(found);
      document.getElementById(firstBad === "message" ? messageId : firstBad)?.focus();
      return;
    }

    setErrors({});
    setSending(true);
    setFailed(false);

    if (!endpoint) {
      const url = buildMailtoUrl(name, email, message);

      if (url.length > MAILTO_MAX_SAFE_LENGTH) {
        setTooLong(true);
        setSending(false);
        setSent(true);
        return;
      }

      window.setTimeout(
        () => {
          window.location.href = url;
          setSending(false);
          setSent(true);
        },
        reduceMotion ? 0 : 420,
      );
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`Endpoint responded ${res.status}`);
      setDelivered(true);
      setSent(true);
    } catch {
      setFailed(true);
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    restoreFocusRef.current = true;
    setName("");
    setEmail("");
    setMessage("");
    setSent(false);
    setDelivered(false);
    setFailed(false);
    setTooLong(false);
    setCopied(false);
    setCopyFailed(false);
    setErrors({});
  };

  const copyMessage = () => {
    const draft = `${name} <${email}>\n\n${message}`;
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyFailed(true);
      return;
    }
    navigator.clipboard.writeText(draft).then(
      () => {
        setCopied(true);
        setCopyFailed(false);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => setCopyFailed(true),
    );
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
          {delivered ? (
            <Check size={15} strokeWidth={2} className="text-accent" />
          ) : failed || tooLong ? (
            <AlertTriangle size={15} strokeWidth={2} className="text-dim" />
          ) : (
            <Mail size={15} strokeWidth={2} className="text-dim" />
          )}
        </div>

        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] max-w-[var(--measure-body)] text-dim">
          {delivered
            ? "Submitted — the server accepted your message. Keeping a copy below in case you want to follow up by email."
            : failed
              ? "That didn't go through — your message wasn't accepted. It's safe below; the quickest route now is email."
              : tooLong
                ? "Your message is longer than an email link can carry, so nothing was opened and nothing was sent — a draft this long arrives cut short, or not at all. Copy it below and paste it into a new email instead."
                : `Your email app should have opened a draft to ${CONTACT_EMAIL} with your message filled in. Nothing happened, or you sent it already — either way, here's a fallback:`}
        </p>
        <div className="flex flex-wrap items-center gap-[0.6rem]">
          <a
            href={tooLong ? `mailto:${CONTACT_EMAIL}` : buildMailtoUrl(name, email, message)}
            className={BORDERED_CONTROL}
          >
            {tooLong ? `Open a blank email to ${CONTACT_EMAIL}` : `Email ${CONTACT_EMAIL} directly`}
          </a>
          <button type="button" onClick={copyMessage} className={BORDERED_CONTROL}>
            {copied ? "Copied" : "Copy message"}
          </button>
        </div>
        {copyFailed && (
          <div>
            <p className="mb-[0.3rem] text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-dim2">
              Copy didn&apos;t work here — select the text below instead:
            </p>
            <textarea
              readOnly
              rows={4}
              value={`${name} <${email}>\n\n${message}`}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full resize-none border border-border bg-transparent p-[0.6rem] text-[length:var(--text-micro)] text-fg outline-none focus:border-accent"
            />
          </div>
        )}
        <button
          type="button"
          onClick={reset}
          className={`self-start ${BORDERED_CONTROL}`}
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
      aria-label={`Send a message to ${CONTACT_EMAIL}`}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: sending ? 1 : 0, opacity: sending ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : beats(0.6), ease: EASE_OUT }}
        className="absolute -bottom-2 left-0 h-px w-full origin-left bg-[image:var(--seam-focus)]"
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
          reduceMotion={reduceMotion}
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
          reduceMotion={reduceMotion}
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
            onFocus={() => setMessageFocused(true)}
            onBlur={() => {
              setMessageFocused(false);
              validateOnBlur("message", message);
            }}
            placeholder="What are you working on?"
            className="w-full resize-none border-0 border-b border-border bg-transparent py-[0.6rem] text-[length:var(--text-body)] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
          />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[image:var(--seam-focus)]"
            initial={false}
            animate={{ scaleX: messageFocused ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : beats(0.4), ease: EASE_OUT }}
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
        variants={fieldMotion}
        type="submit"
        disabled={sending}
        whileHover={reduceMotion || sending ? undefined : { scale: 1.03 }}

        whileTap={sending ? undefined : reduceMotion ? { opacity: 0.7 } : { scale: 0.97 }}
        transition={{ duration: 0.12, ease: EASE_PRESS }}
        className="inline-flex list-none items-center gap-[0.45rem] self-start bg-accent px-[1.375rem] py-[0.7rem] text-[length:var(--text-meta)] font-medium text-white transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent focus-visible:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >

        {endpoint
          ? sending
            ? "Submitting"
            : "Send message"
          : "Open in email app"}{" "}
        <ArrowRight size={13} strokeWidth={1.75} />
      </motion.button>
    </motion.form>
  );
}
