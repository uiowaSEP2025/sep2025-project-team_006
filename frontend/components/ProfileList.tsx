import React from "react";
import Image from "next/image";

interface Profile {
  id: number;
  name: string;
  status: string;
  department: string;
  degree_program: string;
  image: string;
}

interface ProfileListProps {
  profiles: Profile[];
  onProfileClick: (profile: Profile) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, onProfileClick }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {profiles.map((profile, index) => (
        <button
          key={index}
          onClick={() => onProfileClick(profile)}
          className="flex items-center p-4 hover:bg-gray-100 w-full text-left"
        >
          <div className="relative w-12 h-12 mr-4">
            <Image
              src={profile.image}
              alt={profile.name}
              width={48}
              height={48}
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div>
            <div className="text-lg font-medium">{profile.name}</div>
            <div className="text-sm text-gray-600">
              {profile.status} – {profile.department} – {profile.degree_program}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProfileList;
