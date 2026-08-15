const CONTACT_EMAIL = "kakanisnehil@gmail.com";

export function buildMailtoUrl(name: string, email: string, message: string): string {
  const subject = encodeURIComponent(`Message from ${name}`);
  const body = encodeURIComponent(`${name} <${email}>\n\n${message}`);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export { CONTACT_EMAIL };

export const MAILTO_MAX_SAFE_LENGTH = 1900;
