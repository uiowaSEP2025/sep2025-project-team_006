"use client";

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
import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import React from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Simulate login request (replace with API call)
  // Similar to Login component, but hardcoded routes.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          phone_number,
          email,
          password,
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.text();
        setError(data || "Registration failed");
      }
    } catch (e) {
      // (axios issues... i cant attach a catch to this call directly so i need to try/catch)
      console.error(e);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign-Up</CardTitle>
          <CardDescription>
            Enter your email below to Sign-Up for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="Your first name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Your last name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="phone_number"
                  placeholder="(888) 888-8888"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
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

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Re-Enter Password</Label>
                </div>

                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign-Up
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
