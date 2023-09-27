import { IS_BROWSER } from "$fresh/runtime.ts";
import { createClient } from "supabase";

const SUPABASE_URL = "https://vepoznsqsjcrcbepcwjd.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcG96bnNxc2pjcmNiZXBjd2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU3MjkwNjMsImV4cCI6MjAxMTMwNTA2M30.wS8bkQjO7T80KpyvbJ04wsYWulvSYCVmv32BxrQN6Y8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

supabase.auth.onAuthStateChange((event, session) => {
  if (!IS_BROWSER) return;

  // Save the token in cookies on the client so it can be used in the server
  if (event === "SIGNED_OUT") {
    // delete cookies on sign out
    const expires = new Date(0).toUTCString();
    document.cookie =
      `supabase-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
    document.cookie =
      `supabase-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;

    window.location.href = "/";
  } else if (
    (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" ||
      event === "MFA_CHALLENGE_VERIFIED") && session !== null
  ) {
    const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
    document.cookie =
      `supabase-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
    document.cookie =
      `supabase-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
  }
});
