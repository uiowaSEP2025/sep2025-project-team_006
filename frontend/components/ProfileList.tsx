import React from "react";

interface Profile {
    id: number;
    name: string;
    image: string;
}

interface ProfileListProps {
    profiles: Profile[];
    onProfileClick: (profile: Profile) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({profiles, onProfileClick}) => {
    return (
        <div className ="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            {profiles.map((profile) => (
                <button
                    key={profile.id}
                    onClick={() => onProfileClick(profile)}
                    className="flex items-center p-4 hover:bg-gray-100 w-full text-left"
                >
                    <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <span className="text-lg font-medium">{profile.name}</span>
                </button>
            ))}
        </div>
    );
};

export default ProfileList;