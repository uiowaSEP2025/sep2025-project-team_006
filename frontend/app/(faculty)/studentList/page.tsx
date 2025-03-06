"use client";

import { useState } from "react";
import ProfileList from "@/components/ProfileList";

// Define the Profile type
interface Profile {
  id: number;
  name: string;
  image: string;
}

const profiles: Profile[] = [
  { id: 1, name: "Alice Johnson", image: "/defaultpfp.jpeg" },
  { id: 2, name: "Bob Smith", image: "/defaultpfp.jpeg" },
  { id: 3, name: "Charlie Brown", image: "/defaultpfp.jpeg" },
];

export default function Home() {
  // Define selectedProfile with the correct type
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    //alert(`Clicked on ${profile.name}`); // Replace with modal or route navigation
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Profile</h1>
      <ProfileList profiles={profiles} onProfileClick={handleProfileClick} />

      {selectedProfile && (
        <div className="mt-4 p-4 border rounded bg-white shadow-lg">
          <h2 className="text-xl font-semibold">{selectedProfile.name}</h2>
          <img src={selectedProfile.image} alt={selectedProfile.name} className="w-20 h-20 rounded-full mt-2" />
        </div>
      )}
    </div>
  );
}
