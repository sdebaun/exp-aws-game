"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type ConfirmConfig =
  | { type: "none" }
  | { type: "single"; message: string }
  | { type: "double"; first: string; second: string };

type Variant = "primary" | "danger" | "success";

interface AsyncButtonProps {
  /** Action to execute - receives no args, should be pre-bound if needed */
  action: () => Promise<unknown>;
  /** Text/element shown when idle */
  children: ReactNode;
  /** Text/element shown during action execution */
  loadingContent: ReactNode;
  /** Visual variant - controls colors */
  variant?: Variant;
  /** Confirmation requirements before executing */
  confirm?: ConfirmConfig;
  /** Additional className - merged with variant styles */
  className?: string;
  /** Success callback - receives action result */
  onSuccess?: (result: unknown) => void;
}

const VARIANT_STYLES = {
  primary: "bg-blue-600 hover:bg-blue-700",
  success: "bg-green-600 hover:bg-green-700",
  danger: "bg-red-600 hover:bg-red-700",
} as const;

/**
 * A button that handles async actions with:
 * - Loading state management
 * - Optional confirmation dialogs
 * - Error handling with user feedback
 * - Automatic page refresh on success
 *
 * Why this exists: Every admin action button was duplicating this pattern.
 * Keep the action logic in server actions; this just handles the UI dance.
 */
export function AsyncButton({
  action,
  children,
  loadingContent,
  variant = "primary",
  confirm = { type: "none" },
  className = "",
  onSuccess,
}: AsyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    // Handle confirmation - bail early if user declines
    if (confirm.type === "single") {
      if (!window.confirm(confirm.message)) return;
    } else if (confirm.type === "double") {
      if (!window.confirm(confirm.first)) return;
      if (!window.confirm(confirm.second)) return;
    }

    try {
      setIsLoading(true);
      const result = await action();
      onSuccess?.(result);
      router.refresh(); // Always refresh to show updated state
    } catch (error) {
      console.error("[AsyncButton] Action failed:", error);
      alert("Action failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles = "font-bold py-2 px-4 rounded text-white transition-colors";
  const variantStyles = isLoading
    ? "bg-gray-600 cursor-not-allowed"
    : VARIANT_STYLES[variant];

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {isLoading ? loadingContent : children}
    </button>
  );
}