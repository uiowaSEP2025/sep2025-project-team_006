import Image from "next/image";
import Link from 'next/link';
import  HomeDashboard from "@/components/HomeDashboard";

export default function Home() {

  const TestingJunk = [
    {label: "RockOne", href: "/#"},
    {label: "RockTwo", href: "/#"},
    {label: "RockThree", href: "/#"},
  ];

  const learningItems = [
    {label: "FireOne", href: "/#"},
    {label: "FireTwo", href: "/#"},
    {label: "FireThree", href: "/#"},
  ];
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <HomeDashboard title ="TestingJunk" items={TestingJunk}/>
        <HomeDashboard title="TestingFunk" items={learningItems}/>

        <div className="flex gap-12 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/studentList">
            Student List-View
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/metricSetting">
            Settings
          </Link>
        </div>
      </main>
    </div>
  );
}