import HomeDashboard from "@/components/HomeDashboard";
import React from "react";

export default function Home() {
  const Develompent = [
    {
      label: "Student List",
      href: "/studentList",
      image: "./firstYearAdmin.png",
    },
    {
      label: "Template Settings",
      href: "/templateSetting",
      image: "./templateSettings.png",
    },
    {
      label: "Reviewed Applicants",
      href: "/reviewedApplicants",
      image: "./graduateProgram.png",
    },
    {
      label: "Information Page",
      href: "/informationPage",
      image: "./scoreInfo.png",
    },
  ];

  const AdmissionsInformation = [
    {
      label: "Policy Manual",
      href: "https://opsmanual.uiowa.edu/table-of-contents",
      image: "./books.png",
      isExternal: true,
    },
    {
      label: "Procedures",
      href: "https://grad.uiowa.edu/faculty-staff/policies/departmental-and-program-review-procedures",
      image: "./procedures.png",
      isExternal: true,
    },
    {
      label: "Technology Services",
      href: "https://its.uiowa.edu/",
      image: "./information.png",
      isExternal: true,
    },
    {
      label: "Campus Resources",
      href: "https://provost.uiowa.edu/faculty-resources/faculty-resources",
      image: "./gradCollege.png",
      isExternal: true,
    },
    {
      label: "Faculty Directory",
      href: "https://engineering.uiowa.edu/directory",
      image: "./faculty.png",
      isExternal: true,
    },
  ];
  const Assistance = [
    {
      label: "Graduate Specialist",
      href: "https://engineering.uiowa.edu/directory/emory-blair",
      image: "./personInfo.png",
      isExternal: true,
    },
    {
      label: "Graduate Admin",
      href: "https://engineering.uiowa.edu/directory/hans-johnson",
      image: "./boardroom.png",
      isExternal: true,
    },
    {
      label: "Help Video",
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "./video.png",
      isExternal: true,
    },
  ];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 underline underline-offset-4 decoration-black">
        {" "}
        FACULTY HOME PAGE{" "}
      </h1>
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <HomeDashboard title="Faculty Review" items={Develompent} />
        <HomeDashboard title="Information" items={AdmissionsInformation} />
        <HomeDashboard title="Assistance" items={Assistance} />
      </main>
    </div>
  );
}
