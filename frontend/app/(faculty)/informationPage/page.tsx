import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center flex-grow">
        <Image
          className="light"
          src="./GAPpaint.png"
          alt="GAP logo"
          width={360}
          height={38}
          priority
        />
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2x1 font-bold text-black mb-4">
            Information on Metric Scoring
          </h2>

          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Metric Name"
                disabled={true}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                placeholder="Description"
                disabled={true}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="number"
                placeholder="Weight"
                disabled={true}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="number"
                placeholder="Score"
                disabled={true}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                Save
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-semibold text-black mb-2">
              Metric Component Description
            </h3>
            <p>
              Above is a the basic layout of a Metric, the building block of the
              faculty review
            </p>
            <input
              type="text"
              placeholder="Metric Name"
              disabled={true}
              className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p>
              Metric Name is used to provide a brief label for what the metric
              is scoring
            </p>
            <input
              type="text"
              placeholder="Description"
              disabled={true}
              className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p>
              Metric Description is used to provide a description for the metric
              to provide greater detail or clarity on what the metric should be
              scoring
            </p>
            <input
              type="number"
              placeholder="Weight"
              disabled={true}
              className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="number"
              placeholder="Score"
              disabled={true}
              className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p>
              WEIGHT and SCORING is what determines the final scoring of an
              applicant. Weight is a percentage out of 100 to determine the
              signifigance of the category being represented by the metric.
            </p>
            <p>
              SCORE is done on a rating of 1-5, 5 being the highest score
              meaning the applicant as excelled in that category and 1 being the
              lowest meaing the applicant has little to no experience in the
              category
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button asChild>
            <Link href="/facultyHome">Move to Faculty Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
