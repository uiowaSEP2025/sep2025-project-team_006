"use client";

import { useEffect, useState, useMemo } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET } from "@/api/apiMethods";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Profile {
  id: number; //corresponds to student_id
  name: string; //corresponds to full_name
  status: string;
  department: string;
  degree_program: string;
  image: string;
  isReview: boolean;
  reviewScore: number | null;
}

export default function Home() {
  const webService = new WebService();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await apiGET(webService.REVIEW_SUBMITTED);
        if (response.success) {
          const fetchedProfiles: Profile[] = response.payload.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (review: any) => {
              const applicant = review.application;
              return {
                id: applicant.application_id,
                name: `${applicant.student.first_name} ${applicant.student.last_name}`,
                status: applicant.status,
                department: applicant.department,
                degree_program: applicant.degree_program,
                image: "/defaultpfp.jpeg",
                isReview: true,
                reviewScore: review.overall_score,
              };
            },
          );
          setProfiles(fetchedProfiles);
        } else {
          console.log("GET error: ", response.error);
        }
      } catch (error) {
        console.log("An unexpected error occurred: ", error);
      }
    };
    fetchApplicants();
  }, [webService.REVIEW_SUBMITTED]);

  const handleProfileClick = () => {};

  // Filtered and paginated profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [profiles, searchQuery]);

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProfiles.slice(start, start + itemsPerPage);
  }, [filteredProfiles, currentPage]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Profile</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // reset page on new search
        }}
        placeholder="Search by name..."
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />

      <ProfileList
        profiles={paginatedProfiles}
        onProfileClick={handleProfileClick}
      />

      {/* Pagination buttons */}
      <div className="flex space-x-2 my-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-yellow-500 text-black"
                : "bg-gray-300 text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Button asChild>
        <Link href="/facultyHome">Return to Home</Link>
      </Button>
    </div>
  );
}
