import Link from 'next/link';
import  HomeDashboard from "@/components/HomeDashboard";
import { Button } from "@/components/ui/button";

export default function Home() {

  const AdmissionsInformation = [
    {label: "Admissions Profile", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Financial Aid", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Visit Campus", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Scholarship Portal", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Housing Information", href: "/#", image: "/JPGOFIcon.png"},
  ];

  const StudentLearning = [
    {label: "ICON", href: "/#", image: "/JPGOFIcon.png"},
    {label: "SPOT", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Study Spaces", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Student Spaces", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Printing", href: "/#", image: "/JPGOFIcon.png"},
    {label: "LinkedIn Learning", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Academic Support", href: "/#", image: "/JPGOFIcon.png"},
    {label: "UI Libraries", href: "/#", image: "/JPGOFIcon.png"},
  ];

  const StudentInformation = [
    {label: "Academic Calendar", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Address Change", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Advising Appointment", href: "/#", image: "/JPGOFIcon.png"},
    {label: "Admissions Profile", href: "/#", image: "/JPGOFIcon.png"},
  ];

  const StudentInvolvement = [
    {label: "TestOne", href: "/#", image: "/JPGOFIcon.png"},
    {label: "TestTwo", href: "/#", image: "/JPGOFIcon.png"},
    {label: "TestThree", href: "/#", image: "/JPGOFIcon.png"},
  ];



  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 underline underline-offset-4 decoration-black"> STUDENT HOME PAGE </h1>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <HomeDashboard title ="Admissions Information" items={AdmissionsInformation}/>
        <HomeDashboard title="Student Learning" items={StudentLearning}/>
        <HomeDashboard title="Student Information" items={StudentInformation}/>
        <HomeDashboard title="Student Involvement and Support" items={StudentInvolvement}/>
        <Button asChild>
          <Link
            href="/students"
          >
            Move back to Login
          </Link>
          </Button>
      </main>
    </div>
  );
}