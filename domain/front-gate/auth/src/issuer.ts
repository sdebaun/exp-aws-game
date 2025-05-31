import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import z from "zod";

const app = issuer({
  subjects: {
    user: z.object({ userId: z.string() }),
  },
  providers: {
    code: PasswordProvider(
      PasswordUI({
        copy: {
          error_email_taken: "Email already taken",
          error_invalid_code: "Invalid code",
          error_invalid_email: "Invalid email",
          error_invalid_password: "Invalid password",
          error_password_mismatch: "Password mismatch",
          error_validation_error: "Validation error",
          button_continue: "Continue",
        },
        sendCode: async (email, code) => {
          console.log(email, code);
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    return ctx.subject("user", { userId: value.email });
  },
});

export const handler = handle(app);
