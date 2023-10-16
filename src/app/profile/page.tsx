"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState("");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const response = await axios.get("/api/users/user");
    console.log(response.data);
    setUser(response.data.data._id);
    router.push(`/profile/${response.data.data._id}`)
  };

  React.useEffect(() => {
    getUserDetails();
  },[])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      ProfilePage
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
