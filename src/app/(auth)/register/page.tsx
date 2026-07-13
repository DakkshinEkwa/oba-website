import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/forms/AuthShell";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Create your free account",
  description:
    "Join the Ophthalmology Business Academy free to unlock the full library of conversations, articles, and business resources.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your free account"
      subtitle="Unlock the full library of business resources for ophthalmology practices."
      footer={
        <>
          Already a member?{" "}
          <Link href="/login" className="font-semibold text-accent-600 hover:text-accent-700">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
