
"use client"
import axios from "axios";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import toast from "react-hot-toast";

// In Next.js 15, params is a Promise in both server and client components
// In client components, we use use() to unwrap the Promise

interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isAdmin: boolean;
}

export default function UserProfile({params}: {params: Promise<{id: string}>}) {// If we want we can ignore this way and just get the id form the /api/users/me endpoint as well 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isFetchingUser, setIsFetchingUser] = useState(false);
    const { id } = use(params); // Use use() to unwrap the Promise

    // Get user details method
    const getUserDetails = async () => {
        try {
            setIsFetchingUser(true);
            const loadingToast = toast.loading("Fetching user details...");
            
            const response = await axios.get("/api/users/me");
            
            toast.dismiss(loadingToast);
            
            if (response.data.data) {
                setUserData(response.data.data);
                toast.success("User details loaded! 🎉", {
                    duration: 2000,
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                });
            }
        } catch (error: unknown) {
            console.error("Failed to fetch user details:", error);
            
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to fetch user details!", {
                    duration: 4000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                });
            } else {
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
            setIsFetchingUser(false);
        }
    }

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
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
            {/* Header Section */}
            <div className="w-full max-w-4xl mb-8">
                <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                    User Profile
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400">
                    Manage your account and view your details
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8 flex-wrap justify-center">
                <button
                    onClick={getUserDetails}
                    disabled={isFetchingUser}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
                    {isFetchingUser ? "Loading..." : "Get User Details 📋"}
                </button>
                
                <button
                    onClick={logout}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 dark:from-red-600 dark:to-pink-700 dark:hover:from-red-700 dark:hover:to-pink-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
                    {isLoading ? "Logging out..." : "Logout 👋"}
                </button>
            </div>

            {/* Profile ID Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6 w-full max-w-4xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Profile ID</h2>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-inner">
                        <p className="text-4xl md:text-5xl font-bold text-white break-all">{id}</p>
                    </div>
                </div>
            </div>

            {/* User Details Card */}
            {userData && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-4xl border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
                        User Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-md transform transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">👤</span>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Username</h3>
                            </div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 break-all">
                                {userData.username}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-md transform transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">📧</span>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Email</h3>
                            </div>
                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 break-all">
                                {userData.email}
                            </p>
                        </div>

                        {/* Verification Status */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-md transform transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{userData.isVerified ? '✅' : '❌'}</span>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Verification Status</h3>
                            </div>
                            <p className={`text-2xl font-bold ${userData.isVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {userData.isVerified ? 'Verified' : 'Not Verified'}
                            </p>
                        </div>

                        {/* Admin Status */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-md transform transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{userData.isAdmin ? '👑' : '👨‍💼'}</span>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Account Type</h3>
                            </div>
                            <p className={`text-2xl font-bold ${userData.isAdmin ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {userData.isAdmin ? 'Admin' : 'Regular User'}
                            </p>
                        </div>
                    </div>

                    {/* User ID */}
                    <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">🆔</span>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">User ID</h3>
                        </div>
                        <p className="text-lg font-mono text-gray-600 dark:text-gray-400 break-all">
                            {userData._id}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!userData && !isFetchingUser && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 w-full max-w-4xl border border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-center">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No User Details Yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Click the &quot;Get User Details&quot; button to load your information
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}



