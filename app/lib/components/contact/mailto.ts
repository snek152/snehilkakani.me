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
