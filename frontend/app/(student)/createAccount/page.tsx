import Image from "next/image";

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
           <p className="text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Student Sign-Up Page
        </p>


        <form action="." className="max-w-xs mx auto">
        <div className="mb-3">
              <input name="username"autoComplete="off" type ="text" placeholder="Enter Email" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"></input>
            </div>
          <div className="mb-3">
              <input name="username"autoComplete="off" type ="text" placeholder="Enter Username" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"></input>
            </div>
            <div className="mb-3">
              <input name="password"autoComplete="off" type ="text" placeholder="Enter Password" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"></input>
            </div>
            <div className="mb-3">
              <input name="password"autoComplete="off" type ="text" placeholder="Re-Enter Password" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"></input>
            </div>
            <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
              Login</button>
        </form>


        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="students"
            rel="noopener noreferrer"
          >
            Go to Login Page
          </a>
        </div>
      </main>
    </div>
  );
}
