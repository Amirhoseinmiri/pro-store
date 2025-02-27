"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { signUpUser } from "@/lib/actions/user.action";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant={"default"}>
        {pending ? "Signing Up..." : "Sign Up"}
      </Button>
    );
  };
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          autoComplete="name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          placeholder="name@example.com"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          required
          id="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="password"
        />
      </div>
      <div>
        <Label htmlFor="password">Confirm Password</Label>
        <Input
          type="password"
          required
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          autoComplete="confirmPassword"
        />
      </div>
      <div>
        <SignUpButton />
      </div>
      {data && !data.success && (
        <div className="text-sm text-center text-destructive">
          {data.message}
        </div>
      )}
      <div className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href={"/sign-in"} target="_self" className="link">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
