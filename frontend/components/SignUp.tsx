"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import WebService from "@/api/WebService"
import { useState } from "react"
import { apiPOST } from "@/api/apiMethods"

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    const webService = new WebService();
    event.preventDefault(); // Prevent page reload

    console.log("Logging in with:", { email, password });

    // Simulate login request (replace with API call)
    try {
      // this is a terribly ugly hack.
      let url, role, nnnext;
      url = webService.AUTH_STUDENT_REGISTER;
      role = "student";
      nnnext = "/studentHome"

      const resp = await apiPOST(url, JSON.stringify({ email, password }));
      if (resp.success) {
        console.log("Login successful!");
        console.log(resp.payload);
        localStorage.setItem("token", resp.payload["token"]);
        localStorage.setItem("session", resp.payload["session"]);
        localStorage.setItem("role", role);
        window.location.replace(nnnext);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
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

                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
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
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
