import Link from 'next/link';
import "./globals.css";
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('./background_image.jpg')" }}
    >
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to GAP
        </h1>
        <p className="text-xl text-white mb-8">
          Your one-stop solution for graduate student management.
        </p>
        <div className="flex gap-6">
          <Button asChild>
          <Link
            href="/faculty">
            Faculty
          </Link>
          </Button>
          <Button asChild>
          <Link
            href="/students">
            Students
          </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
