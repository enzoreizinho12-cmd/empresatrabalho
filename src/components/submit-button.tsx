"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingLabel, className, disabled = false }: { children: React.ReactNode; pendingLabel: string; className: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={disabled || pending} aria-disabled={disabled || pending} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
    {pending && <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true"/>}
    {pending ? pendingLabel : children}
  </button>;
}
