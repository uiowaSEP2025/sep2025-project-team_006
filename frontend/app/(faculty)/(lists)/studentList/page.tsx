"use client";

import React from "react";
import { useEffect, useState, useMemo } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET } from "@/api/apiMethods";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
//import { Heart } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Check, ChevronUp, ChevronDown } from "lucide-react";

interface Profile {
  id: number; //corresponds to student_id
  name: string; //corresponds to full_name
  status: string;
  department: string;
  degree_program: string;
  image: string;
  isReview: boolean;
  reviewScore: number | null;
  liked: boolean;
}

export default function Home() {
  const router = useRouter();
  const webService = new WebService();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "name" | "status" | "department" | "degree" | "liked"
  >("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await apiGET(webService.STUDENTS_APPLICANT_LIST);
        const reviewedResponse = await apiGET(webService.REVIEW_SUBMITTED);

        if (response.success && reviewedResponse.success) {
          console.log("All Applicants:", response.payload);
          console.log("Reviewed Applications:", reviewedResponse.payload);
          const reviewedIds = new Set(
            reviewedResponse.payload.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (review: any) => review.application.application_id,
            ),
          );

          console.log("Reviewed: ", reviewedIds);

          const fetchedProfiles: Profile[] = response.payload.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (applicant: any) => !reviewedIds.has(applicant.application_id))
            .map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (applicant: any) => ({
              id: applicant.student_id,
              name: applicant.full_name,
              status: applicant.status,
              department: applicant.department,
              degree_program: applicant.degree_program,
              image: "/defaultpfp.jpeg",
              isReview: false,
              reviewScore: null,
              liked: reviewedResponse.payload.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (r: any) => r.application.application_id === applicant.application_id
              )?.liked ?? false,
            }),
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
  }, [webService.STUDENTS_APPLICANT_LIST, webService.REVIEW_SUBMITTED]);

  const handleProfileClick = (profile: Profile) => {
    router.push(`/studentList/application?id=${profile.id}`);
  };

  // Filtered and paginated profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const query = searchQuery.toLowerCase();
      switch (filterType) {
        case "name":
          return p.name.toLowerCase().includes(query);
        case "status":
          return p.status.toLowerCase().includes(query);
        case "department":
          return p.department.toLowerCase().includes(query);
        case "degree":
          return p.degree_program.toLowerCase().includes(query);
        //case "liked":
          //return p.liked === true;
        default:
          return true;
      }
    });
  }, [profiles, searchQuery, filterType]);

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProfiles.slice(start, start + itemsPerPage);
  }, [filteredProfiles, currentPage]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Profile</h1>

      {/* Sticky search + filter bar */}
      <div className="sticky top-0 z-10 bg-gray-100 w-full py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 px-4 w-full max-w-3xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by..."
            className="p-2 border border-gray-300 rounded flex-grow mb-2 sm:mb-0"
          />

          {/*eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Select onValueChange={(value) => setFilterType(value as any)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Name
                </span>
              </SelectItem>
              <SelectItem value="status">
                <span className="flex items-center gap-2">
                  <ChevronUp className="w-4 h-4" /> Status
                </span>
              </SelectItem>
              <SelectItem value="department">
                <span className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" /> Department
                </span>
              </SelectItem>
              <SelectItem value="degree">
                <span className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 rotate-90" /> Program
                </span>
              </SelectItem>
              {/*<SelectItem value="liked">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Liked
                </span>
              </SelectItem>*/}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProfileList
        profiles={paginatedProfiles}
        onProfileClick={handleProfileClick}
      />

      {/* Pagination buttons */}
      <Pagination className="my-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>


      <Button asChild>
        <Link href="/facultyHome">Return to Home</Link>
      </Button>
    </div>
  );
}