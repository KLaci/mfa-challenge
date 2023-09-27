import { effect, useSignal } from "@preact/signals";
import { supabase } from "../lib/supabase.ts";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { tw } from "twind";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";
import { getUserAction, getUserActionClient } from "../lib/auth.ts";

export default function VerifyMFA() {
  const [factorId, setFactorId] = useState("");

  const [error, setError] = useState(""); // holds an error message

  useEffect(() => {
    const enroll = async () => {
      if (!IS_BROWSER) return;

      const userAction = await getUserActionClient();

      if (userAction !== "/verify-mfa") {
        window.location.href = userAction;
        return;
      }

      const factors = await supabase.auth.mfa.listFactors();

      const totp = factors.data?.totp[0];

      if (!totp) {
        window.location.href = "/enroll-mfa";
        return;
      }

      setFactorId(totp.id);
    };
    enroll();
  }, []);

  const onSubmit = async (e: Event) => {
    const formData = new FormData(e.target as HTMLFormElement);
    const otp = formData.get("otp");

    const challenge = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: String(otp),
    });

    if (challenge.error) {
      setError(challenge.error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div
      className={tw`flex flex-col gap-4 items-center p-4`}
    >
      <form
        className={tw`flex flex-col gap-2 items-center`}
        method="post"
        onSubmit={(e) => {
          onSubmit(e);
          e.preventDefault();
          return false;
        }}
      >
        <p>Type your One-Time Password</p>
        <Input type="text" label="One Time Password" name="otp" />
        <Button type="submit">Sign in</Button>
        {error && <p class={tw`text-red-600`}>{error}</p>}
      </form>
    </div>
  );
}
