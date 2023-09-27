import { effect, useSignal } from "@preact/signals";
import { supabase } from "../lib/supabase.ts";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { tw } from "twind";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";
import { getUserAction, getUserActionClient } from "../lib/auth.ts";

export default function MFAEnrollment() {
  const [factorId, setFactorId] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const enroll = async () => {
      if (!IS_BROWSER) return;

      const userAction = await getUserActionClient();

      if (userAction !== "/enroll-mfa") {
        window.location.href = userAction;
        return;
      }

      const factors = await supabase.auth.mfa.listFactors();

      // Unenroll all existing factors to remove stale ones
      for (const factor of factors.data?.all ?? []) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });

      if (error) {
        setError(error.message);
        return;
      }

      setFactorId(data.id);
      setQr(data.totp.qr_code);
    };
    enroll();
  }, []);

  const onSubmit = async (
    e: Event,
  ) => {
    const formData = new FormData(e.target as HTMLFormElement);
    const otp = formData.get("otp");

    const challenge = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (challenge.error) {
      setError(challenge.error.message);
      return;
    }

    const challengeId = challenge.data.id;

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code: String(otp),
    });

    if (verify.error) {
      setError(verify.error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div
      className={tw`flex flex-col gap-4 items-center p-4`}
    >
      <img src={qr} />
      <form
        className={tw`flex flex-col gap-2 items-center`}
        method="post"
        onSubmit={(e) => {
          onSubmit(e);
          e.preventDefault();
          return false;
        }}
      >
        <Input type="text" label="One Time Password" name="otp" />
        <Button type="submit">Enroll</Button>
        {error && <p class={tw`text-red-600`}>{error}</p>}
      </form>
    </div>
  );
}
