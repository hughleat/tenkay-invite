const ENDPOINT_DOCUMENT_URL =
  "https://raw.githubusercontent.com/hughleat/tenkay-invite/main/tenkay-endpoint.json";
const INVITE_TOKEN = /^[A-Za-z0-9_-]{32,128}$/;

export function invitationToken(hash) {
  const candidate = hash.startsWith("#") ? hash.slice(1) : hash;
  return INVITE_TOKEN.test(candidate) ? candidate : null;
}

export function validatedApiBase(value) {
  if (typeof value !== "string" || value.length > 256) return null;
  try {
    const url = new URL(value);
    const validHost = url.hostname.endsWith(".loca.lt") &&
      url.hostname.length > ".loca.lt".length;
    if (
      url.protocol !== "https:" ||
      !validHost ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.pathname !== "/" && url.pathname !== "")
    ) return null;
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return null;
  }
}

async function currentApiBase() {
  const response = await fetch(
    `${ENDPOINT_DOCUMENT_URL}?refresh=${Date.now()}`,
    { cache: "no-store", referrerPolicy: "no-referrer" },
  );
  if (!response.ok) throw new Error("endpoint lookup failed");
  const document = await response.json();
  const apiBase = validatedApiBase(document.apiBaseUrl);
  if (apiBase === null) throw new Error("endpoint was invalid");
  return apiBase;
}

async function openInvitation() {
  const status = document.querySelector("#status");
  const retry = document.querySelector("#retry");
  const token = invitationToken(window.location.hash);
  if (token === null) {
    status.textContent = "This invitation link is incomplete or invalid.";
    retry.hidden = true;
    return;
  }

  status.textContent = "Finding the current Tenkay server…";
  retry.hidden = true;
  try {
    const apiBase = await currentApiBase();
    window.location.replace(`${apiBase}/invite/${encodeURIComponent(token)}`);
  } catch {
    status.textContent = "Tenkay’s server could not be reached just now.";
    retry.hidden = false;
  }
}

if (typeof window !== "undefined") {
  document.querySelector("#retry").addEventListener("click", openInvitation);
  openInvitation();
}
