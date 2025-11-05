"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        //? Get user ID from token and redirect to their profile
        const redirectToUserProfile = async () => {
            try {
                //? Call API to get current user's data
                const response = await axios.get("/api/users/me");
                const userId = response.data.data._id;
                
                //? Redirect to user's own profile
                router.replace(`/profile/${userId}`);
            } catch (error) {
                console.error("Failed to get user data:", error);
                toast.error("Failed to load profile");
                //? If error, redirect to home
                router.replace("/");
            }
        };

        redirectToUserProfile();
    }, [router]);

    //? Show loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 font-semibold">Loading your profile...</p>
            </div>
        </div>
    );
}
 