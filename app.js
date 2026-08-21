const INVITE_TOKEN = /^[A-Za-z0-9_-]{32,128}$/;
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.hughleat.tenkay";

export function invitationToken(hash) {
  const candidate = hash.startsWith("#") ? hash.slice(1) : hash;
  return INVITE_TOKEN.test(candidate) ? candidate : null;
}

export function invitationTargets(token, android = false) {
  if (!INVITE_TOKEN.test(token)) return null;
  const encoded = encodeURIComponent(token);
  const deepLink = `tenkay://invite/${encoded}`;
  const playStore = `${PLAY_STORE_URL}&referrer=${encodeURIComponent(`tenkay_invite=${token}`)}`;
  const open = android
    ? `intent://invite/${encoded}#Intent;scheme=tenkay;package=com.hughleat.tenkay;` +
      `S.browser_fallback_url=${encodeURIComponent(playStore)};end`
    : deepLink;
  return { open, playStore };
}

function showInvitation() {
  const status = document.querySelector("#status");
  const open = document.querySelector("#open");
  const play = document.querySelector("#play");
  const token = invitationToken(window.location.hash);
  if (token === null) {
    status.textContent = "This invitation link is incomplete or invalid.";
    open.hidden = true;
    return;
  }

  const android = /Android/i.test(window.navigator.userAgent);
  const targets = invitationTargets(token, android);
  status.textContent = android
    ? "Open Tenkay to connect with your friend."
    : "Open this invitation on your Android device to connect with your friend.";
  open.href = targets.open;
  open.hidden = false;
  play.href = targets.playStore;
}

if (typeof window !== "undefined") {
  showInvitation();
}
