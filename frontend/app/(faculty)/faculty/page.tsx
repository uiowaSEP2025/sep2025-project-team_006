import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/Login";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="light"
          src="./GAPpaint.png"
          alt="GAP logo"
          width={360}
          height={38}
          priority
        />
        <LoginForm showSignUpLink={false} />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button asChild>
            <Link href="/">Move to Last Page</Link>
          </Button>
          <Button asChild>
            <Link href="/facultyHome">Move to Next Page</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
