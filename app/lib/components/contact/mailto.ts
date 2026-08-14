const CONTACT_EMAIL = "kakanisnehil@gmail.com";

/**
 * Builds the exact mailto URL used by the Reach form: subject announces the
 * sender, body restates their identity above the free-form message so a
 * reply-all from any client still has the context.
 */
export function buildMailtoUrl(name: string, email: string, message: string): string {
  const subject = encodeURIComponent(`Message from ${name}`);
  const body = encodeURIComponent(`${name} <${email}>\n\n${message}`);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export { CONTACT_EMAIL };

/**
 * The longest composed `mailto:` URL worth attempting.
 *
 * A `mailto:` handoff is a URL, and URL length caps live in the OS and the
 * mail client, not in the page: several Windows shell-launch paths cut off
 * around 2048 characters and older clients around 2083. Past that the draft
 * opens silently truncated, or does not open at all — and because the handoff
 * is undetectable either way (the whole reason this path never claims
 * delivery), the visitor would be told their mail app "should have opened"
 * while their message was quietly cut in half.
 *
 * 1900 leaves headroom under the lowest real cap. A message over it is not
 * handed off at all; the form says so and offers the draft to copy, which is
 * the one route that cannot silently lose text.
 */
export const MAILTO_MAX_SAFE_LENGTH = 1900;
