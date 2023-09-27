import { tw } from "twind";
import { Input } from "../components/Input.tsx";
import { Button } from "../components/Button.tsx";
import { useSignal } from "@preact/signals";
import { supabase } from "../lib/supabase.ts";
import { useState } from "preact/hooks";

export default function SetPasswordForm() {
  const [error, setError] = useState("");

  const onSubmit = async (
    e: Event,
  ) => {
    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const password = formData.get("password");

      const response = await supabase.auth.updateUser({
        password: String(password),
      });

      if (response.data.user) {
        window.location.href = "/enroll-mfa";
      } else {
        throw new Error("Error setting password");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form
        method="post"
        onSubmit={(e) => {
          onSubmit(e);
          e.preventDefault();
          return false;
        }}
        className={tw`flex flex-col gap-4 items-center p-4`}
      >
        <Input
          type="password"
          name="password"
          label="Password"
        />

        <Button type="submit">Set your password</Button>
        <p class={tw`text-red-600`}>{error}</p>
      </form>
    </div>
  );
}
