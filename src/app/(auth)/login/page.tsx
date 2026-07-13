import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/forms/AuthShell";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Ophthalmology Business Academy account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to access your OB Academy resources."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-accent-600 hover:text-accent-700">
            Create one free
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
