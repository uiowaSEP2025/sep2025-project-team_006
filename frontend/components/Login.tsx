"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  //signUpHref?: string
  showSignUpLink?: boolean;
};

export function LoginForm({
  className,
  //signUpHref = "/createAccount",
  showSignUpLink = true,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // still a bit of an ugly hack... but its better now atleast
    if (res.ok) {
      if (location.pathname == "/students") {
        localStorage.setItem("role", "student");
        router.push("/studentHome");
      } else {
        localStorage.setItem("role", "student");
        router.push("/facultyHome");
      }
    } else {
      const data = await res.text();
      setError(data || "Login failed");
    }
  };

  /*
  const handleSubmit = async (event: React.FormEvent) => {
    const webService = new WebService();
    event.preventDefault(); // Prevent page reload

    // Simulate login request (replace with API call)
    // this is a terribly ugly hack.
    let url, role, nnnext;
    if (location.pathname == "/students") {
      url = webService.AUTH_STUDENT_LOGIN;
      role = "student";
      nnnext = "/studentHome";
    } else {
      url = webService.AUTH_STUDENT_LOGIN; // no faculty endpoint... but student login endpoint will "Just Work"
      role = "faculty";
      nnnext = "/facultyHome";
    }

    let resp;
    try {
      resp = await apiPOST(url, JSON.stringify({ email, password }));
      if (resp.success) {
        localStorage.setItem("token", resp.payload["token"]);
        localStorage.setItem("session", resp.payload["session"]);
        localStorage.setItem("role", role);
        window.location.replace(nnnext);
      } else {
        console.error("Login failed");
      }
    } catch (e) {
      // (axios issues... i cant attach a catch to this call directly so i need to try/catch)
      console.error(e);
    }
  };
  */

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Outlook
              </Button>
            </div>
            {showSignUpLink && (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/createAccount"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
