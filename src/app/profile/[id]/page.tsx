
"use client"
import axios from "axios";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import toast from "react-hot-toast";

// In Next.js 15, params is a Promise in both server and client components
// In client components, we use use() to unwrap the Promise

export default function UserProfile({params}: {params: Promise<{id: string}>}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { id } = use(params); // Use use() to unwrap the Promise

    //LogOut Method
    const logout = async () => {
        try {
            setIsLoading(true);
            
            // Show loading toast
            const loadingToast = toast.loading("Logging out...");
            
            const response = await axios.get("/api/users/logout");
            
            // Dismiss loading toast
            toast.dismiss(loadingToast);
            
            if (response.data.sucess) { //? IF the value of sucess is true then do this 
                // Show success toast
                console.log("Logout successful!");
                toast.success("Logged out successfully! 👋", {
                    duration: 2000,
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                });
                
                // Redirect to login page after successful logout
                setTimeout(() => {
                    router.push("/login");
                }, 1000);
            }
            
        } catch (error: unknown) {
            console.error("Logout failed:", error);
            
            if (axios.isAxiosError(error)) {
                console.log("Error message:", error.response?.data?.error);
                toast.error(error.response?.data?.error || "Logout failed! Please try again.", {
                    duration: 4000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                });
            } else {
                console.error("An unexpected error occurred:", error);
                
                toast.error("An unexpected error occurred! 😕", {
                    duration: 4000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                });
            }
        } finally {
            setIsLoading(false);
        }        
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <button
            onClick={logout}
            disabled={isLoading}
            className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? "Logging out..." : "Logout"}
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <hr className="border-gray-200 dark:border-gray-700" />
                <p className="text-7xl font-semibold text-blue-600 dark:text-blue-400">{id}</p>
            </div>
        </div>
    );
}



