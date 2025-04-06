import Image from "next/image";
import Link from "next/link";
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
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2x1 font-bold text-black mb-4">Metrics</h2>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Metric Name"
              disabled={true}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="text"
              placeholder="Metric Description"
              disabled={true}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="number"
              placeholder="Weight"
              disabled={true}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
        </div>
            <div>
              <button
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Save
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
        </div>
    </div>

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

