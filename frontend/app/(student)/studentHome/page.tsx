import Link from "next/link";
import HomeDashboard from "@/components/HomeDashboard";
import { Button } from "@/components/ui/button";
import React from "react";

export default function StudentHome() {
  const GraduateAdmissions = [
    {
      label: "Create Application",
      href: "/createApplicants",
      image: "./uploadIOWA.png",
    },
    {
      label: "Graduate Form",
      href: " https://docs.google.com/forms/d/e/1FAIpQLSe3Vkjd09Fw_irsg62TQhr8_Z47ctYp0HMzhIMANFjNDYKXlw/viewform?usp=header",
      image: "./createApplication.png",
      isExternal: true,
    },
    {
      label: "First-Year Admission",
      href: "https://admissions.uiowa.edu/apply/how-apply/first-year-admissions",
      image: "./firstYearAdmin.png",
      isExternal: true,
    },
  ];

  const StudentSites = [
    {
      label: "UIOWA",
      href: "https://uiowa.edu/",
      image: "./oldCapitol.png",
      isExternal: true,
    },
    {
      label: "MyUI",
      href: " https://myui.uiowa.edu/my-ui/home.page",
      image: "./myUI.png",
      isExternal: true,
    },
    {
      label: "ICON",
      href: "https://icon.uiowa.edu/students",
      image: "./ICON icon_0.jpg",
      isExternal: true,
    },
    {
      label: "Graduate College",
      href: "https://grad.uiowa.edu/",
      image: "./gradCollege.png",
      isExternal: true,
    },
    {
      label: "Graduate Programs",
      href: "https://grad.uiowa.edu/",
      image: "./graduateProgram.png",
      isExternal: true,
    },
  ];

  const Financial = [
    {
      label: "Donations",
      href: "https://donate.givetoiowa.org/s/1773/foundation/interior.aspx?sid=1773&gid=2&pgid=501&cid=1237&appealcode=2021GFWA",
      image: "./donate.png",
      isExternal: true,
    },
    {
      label: "Financial Assistance",
      href: "https://grad.uiowa.edu/funding/graduate-assistantships-and-loans",
      image: "./piggyBank.png",
      isExternal: true,
    },
  ];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 underline underline-offset-4 decoration-black">
        {" "}
        STUDENT HOME PAGE{" "}
      </h1>
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <HomeDashboard
          title="Admissions Information"
          items={GraduateAdmissions}
        />
        <HomeDashboard title="Student Sites" items={StudentSites} />
        <HomeDashboard title="Finances" items={Financial} />

        <Button asChild>
          <Link href="/students">Move back to Login</Link>
        </Button>
      </main>
    </div>
  );
}
