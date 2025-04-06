"use client";

import { useEffect, useState } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET } from "@/api/apiMethods";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Profile {
  id: number; // corresponds to student_id
  name: string; // corresponds to full_name
  status: string;
  department: string;
  degree_program: string;
  image: string;
}

export default function Home() {
  const router = useRouter();
  const webService = new WebService();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await apiGET(webService.STUDENTS_APPLICANT_LIST);
        if (response.success) {
          const fetchedProfiles: Profile[] = response.payload.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (applicant: any) => ({
              id: applicant.student_id,
              name: applicant.full_name,
              status: applicant.status,
              department: applicant.department,
              degree_program: applicant.degree_program,
              image: "/defaultpfp.jpeg", // default profile picture
            }),
          );
          setProfiles(fetchedProfiles);
        } else {
          console.log("GET error: ", response.error);
        }
      } catch (error) {
        console.log("An unexpected error occured: ", error);
      }
    };
    fetchApplicants();
  }, [webService.STUDENTS_APPLICANT_LIST]);

  const handleProfileClick = (profile: Profile) => {
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Profile</h1>
      <ProfileList profiles={profiles} onProfileClick={handleProfileClick} />
      <Button asChild>
        <Link href="/facultyHome">Return to Home</Link>
      </Button>
    </div>
  );
}