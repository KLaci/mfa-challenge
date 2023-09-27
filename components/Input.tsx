import { tw } from "twind";
import { h } from "preact";

interface InputProps {
  label: string;
  name: string;
  type: string;
  readonly?: boolean;
}

export function Input({ label, name, type, readonly }: InputProps) {
  return (
    <div class={tw`flex flex-col`}>
      <label class={tw`mb-1 font-medium text-gray-700`}>{label}</label>
      <input
        readOnly={readonly}
        class={tw`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        type={type}
        name={name}
      />
    </div>
  );
}
