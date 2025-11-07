"use client";
import React,{useState,useEffect} from "react";
import axios from "axios";
import {useRouter} from "next/navigation"; //! ADDED: For redirecting after verification



export default function VerifyEmailPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [verifyied,setverified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false); //! ADDED: Loading state for better UX


    const VerifyUserEmail = async () => {
        try {
            setLoading(true);
            //! FIXED: Changed /verifyemail to /verifyEmail (capital E) to match folder name
            await axios.post("/api/users/verifyEmail", { token });
            setverified(true);
            setError(false);
            
            //! FIXED: Use router.replace instead of router.push for proper redirect
            //! IMPROVED: Auto redirect to login after 3 seconds
            setTimeout(() => {
                router.replace("/login");
            }, 3000);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            setError(true);
            setverified(false);
            console.log(error.response?.data || error.message);
        } finally {
            setLoading(false); //! ADDED: Stop loading in both success and error cases
        }
    }

    //! IMPROVED: Extract token from URL on component mount
    useEffect(() => {
        //! FIXED: Properly decode the URL token
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        setToken(urlToken || "");
        
        //! ADDED: Redirect to login if no token in URL (prevents direct access)
        if (!urlToken) {
            setTimeout(() => {
                router.replace("/login");
            }, 2000);
        }
    }, [router]);

    //! IMPROVED: Automatically verify when token is available
    useEffect(() => {
        if (token.length > 0) {
            VerifyUserEmail();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-linear-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Email Verification</h1>
                    <p className="text-gray-600">Please wait while we verify your email address</p>
                </div>

                {/* Show loading state while verification is in progress */}
                {loading && !verifyied && !error && (
                    <div className="flex flex-col items-center py-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-600">Verifying...</p>
                    </div>
                )}

                {/* Show if no token provided in URL */}
                {!token && !loading && (
                    <div className="text-center py-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-600 mb-2">No Token Found</h2>
                        <p className="text-gray-600 mb-4">Please use the verification link sent to your email.</p>
                        <p className="text-sm text-gray-500">Redirecting to login...</p>
                    </div>
                )}

                {/* Show success state */}
                {verifyied && (
                    <div className="text-center py-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Verified Successfully!</h2>
                        <p className="text-gray-600 mb-4">Your email has been verified.</p>
                        <p className="text-sm text-gray-500 mb-4">Redirecting to login in 3 seconds...</p>
                        <a href="/login" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Go to Login Now
                        </a>
                    </div>
                )}

                {/* Show error state */}
                {error && !loading && (
                    <div className="text-center py-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-4">Unable to verify your email. The link may be expired or invalid.</p>
                        <a href="/signup" className="inline-block px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                            Back to Signup
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
