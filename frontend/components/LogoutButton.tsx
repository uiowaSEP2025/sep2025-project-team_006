"use client";

import { useCookies } from 'next-client-cookies';
import { useRouter } from "next/navigation";
import { useState } from "react";
import WebService from '@/api/WebService';

export default function LogoutButton() {
  const router = useRouter();
  const cookies = useCookies();
  const [loading, setLoading] = useState(false);
  const webService = new WebService();

  const handleLogout = async () => {
    setLoading(true);

    const session = cookies.get("gap_session");
    if (session) {
        const resp = await fetch(webService.AUTH_STUDENT_LOGOUT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ session }),
        });        

        if (resp.ok) {
          router.push("/");
          cookies.remove("gap_session");
          cookies.remove("gap_token"); 
        } else {
          alert("Logout failed");
        }

        setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm bg-[#F1BE48] text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
