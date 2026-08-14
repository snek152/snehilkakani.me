"use client";

import { useId, useState } from "react";
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

/** The `--ease-press` curve from globals.css, as a bezier motion can drive.
 * The submit button is a `motion.button` with an animated entrance, so it
 * carries an inline `transform` — an `active:scale-*` class cannot reach
 * past that, and the press has to be a gesture rather than a CSS state. */
const EASE_PRESS = [0.23, 1, 0.32, 1] as const;

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  reduceMotion,
  error,
}: {
  id: string;
  label: string;
  type: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  reduceMotion: boolean;
  error?: string;
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
      {/* The input's own bottom border is already the rule; on focus an
        * accent overlay draws along it from the caret side (left, for LTR)
        * instead of the border switching colour outright. `focus:border-accent`
        * stays as the non-motion fallback, so a failed script still shows
        * focus. */}
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full border-0 border-b border-border bg-transparent py-[0.6rem] text-[length:var(--text-body)] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--accent),#6d5ede,var(--accent))]"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : beats(0.4), ease: EASE_OUT }}
        />
      </div>
      {/* Full-contrast `text-fg` against the `text-dim` label, rather than a
        * red: this palette is three greys and one blue, and a semantic colour
        * introduced for three strings would be a new design decision rather
        * than a fix. The problem is carried by the words, the position, and
        * `aria-invalid` — never by hue alone. */}
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

/**
 * Names the actual problem, not "invalid input".
 *
 * The form used to lean on the browser's own bubble, which says "Please fill
 * out this field" in Chrome's voice — a different register from every other
 * sentence on the site, unstyled, and gone the moment you click away. These
 * strings say what is wrong and what to do, in the same plain register as the
 * confirmation copy.
 */
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
  /* Only true when a configured endpoint returned 2xx — the one case in which
   * this form may honestly say the message was delivered. */
  const [delivered, setDelivered] = useState(false);
  const [failed, setFailed] = useState(false);
  /* The composed `mailto:` URL was too long to hand to a mail client, so no
   * handoff was attempted. Distinct from `failed`: nothing was rejected, we
   * declined to try something that loses text silently. */
  const [tooLong, setTooLong] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  const messageId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});

  /* Cleared as the visitor types, not re-checked on every keystroke: telling
   * someone their address is malformed while they are still halfway through
   * typing it is nagging, not help. The check runs on submit; editing a field
   * retires its complaint. */
  const clearError = (key: keyof FieldErrors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  /* Two delivery paths, and which one is live is a deployment decision, not a
   * code change.
   *
   * `NEXT_PUBLIC_CONTACT_ENDPOINT` set  -> POST the message and report the
   *   real outcome. Only `res.ok` counts as delivered: a resolved `fetch` says
   *   the request completed, not that the server accepted it, and a 500 that
   *   reported success would be the exact lie the mailto path was written to
   *   avoid.
   * unset (today) -> the original mailto handoff, whose copy never claims
   *   delivery because the OS launching a mail client cannot be detected.
   *
   * The draft is never cleared by either path. It stays in state so the
   * confirmation can show it back, which is what makes the failure case
   * recoverable. */
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* The form carries `noValidate`, so this is the only gate — and it runs
       before `sending` flips, so a rejected submit never shows the sending
       hairline for a request that was never made. Focus moves to the first
       field with a problem: an error message nobody is looking at is not a
       message. */
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

      // Declining the handoff is the honest move: past this length the draft
      // opens truncated or not at all, and neither is detectable, so
      // attempting it would produce a confident message about something that
      // silently ate the visitor's text.
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
      // Network error, CORS rejection, or a non-2xx status. The message is
      // still in state, so the confirmation offers the mailto route and the
      // copyable draft rather than dead-ending.
      setFailed(true);
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
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
    // Clipboard access can be unavailable (insecure origin, no navigator.clipboard)
    // or rejected (denied permission). Either way, fall back to selectable text
    // instead of silently doing nothing.
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
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-[0.875rem]"
        role="status"
        aria-live="polite"
      >
        {/* The icon has to agree with the sentence under it. A check means
         * delivered and nothing else; the mailto handoff gets a neutral mail
         * glyph because nobody can know whether it worked, and both the
         * rejected and the not-attempted cases get a warning. The old code
         * showed a check above a paragraph that immediately retracted it. */}
        <div className="flex size-9 items-center justify-center border border-border">
          {delivered ? (
            <Check size={15} strokeWidth={2} className="text-accent" />
          ) : failed || tooLong ? (
            <AlertTriangle size={15} strokeWidth={2} className="text-dim" />
          ) : (
            <Mail size={15} strokeWidth={2} className="text-dim" />
          )}
        </div>
        {/* Each branch claims exactly what the code proved and nothing more.
         * `res.ok` means the endpoint accepted the payload — not that it
         * reached a person, and not that a reply is coming, so the copy says
         * "accepted" and stops there. The mailto branch cannot even prove that
         * much, and the too-long branch is the one case where we know for
         * certain nothing was attempted, so it says so outright rather than
         * describing a draft that was never opened. Overclaiming here is the
         * specific defect this rewrite fixed. */}
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
          {/* An empty draft when the message could not ride along: handing the
            * same oversized URL to this link would fail the same way the
            * submit just declined to. The copy button beside it holds the
            * text. */}
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
      /* Ours, not Chrome's. `required` stays on every control for semantics
         (assistive tech announces it), but the browser's own bubble is
         suppressed so the messaging is the site's rather than the vendor's. */
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
        transition={{ duration: reduceMotion ? 0 : 0.38, ease: EASE_OUT }}
        className="absolute -bottom-2 left-0 h-px w-full origin-left bg-[linear-gradient(90deg,var(--accent),#6d5ede,var(--accent))]"
      />
      <motion.div variants={fieldMotion}>
        <Field
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={(v) => {
            setName(v);
            clearError("name");
          }}
          placeholder="Your name"
          autoComplete="name"
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
            onBlur={() => setMessageFocused(false)}
            placeholder="What are you working on?"
            className="w-full resize-none border-0 border-b border-border bg-transparent py-[0.6rem] text-[length:var(--text-body)] text-fg outline-none transition-colors duration-150 placeholder:text-dim2 focus:border-accent"
          />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--accent),#6d5ede,var(--accent))]"
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
        /* A second activation while the first is in flight would POST the
         * message twice, or fire a second `mailto:` navigation on top of the
         * first. Enter-on-focus makes that trivially easy, so the button is
         * inert for the duration rather than merely looking busy. */
        disabled={sending}
        whileHover={reduceMotion || sending ? undefined : { scale: 1.03 }}
        /* Reduced motion drops the scale, so the press moves to a channel
         * that isn't movement rather than disappearing: feedback that the
         * form was submitted is not decoration. The old spring here was
         * underdamped (damping 25 against stiffness 400) and overshot on
         * release; the press curve settles without the bounce. */
        whileTap={sending ? undefined : reduceMotion ? { opacity: 0.7 } : { scale: 0.97 }}
        transition={{ duration: 0.12, ease: EASE_PRESS }}
        className="inline-flex list-none items-center gap-[0.45rem] self-start bg-accent px-[1.375rem] py-[0.7rem] text-[length:var(--text-meta)] font-medium text-white transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent focus-visible:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* The label has to match what this click actually does, because this
          * is where the expectation forms — before any confirmation copy is
          * read. With no endpoint configured the click opens a draft in the
          * visitor's own mail app and sends nothing, so it must not say
          * "Send"; with an endpoint it really does submit. */}
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
