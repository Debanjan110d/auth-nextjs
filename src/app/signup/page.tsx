"use client";//? Now its a client component

import Link from "next/link";
import { useRouter } from "next/navigation"; //? useRouter hook from next/navigation for client components
import React from "react";
import axios from "axios"; //? axios for making HTTP requests
import toast from "react-hot-toast"; //? toast for showing notifications to user


export default function SignUpPage() {
    //? useRouter hook to navigate between pages programmatically
    const router = useRouter();
    
    //? State to store user input data (username, email, password)
    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password :"",
    });
    
    //? State to toggle password visibility (show/hide password)
    const [showPassword, setShowPassword] = React.useState(false);

    //? State to track loading status during API call (prevents double submission)
    const [loading, setLoading] = React.useState(false);


    // simple email validation
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // compute buttonDisabled directly (derived state)
    const usernameOk = user.username.trim().length > 0;
    const emailOk = isValidEmail(user.email);
    const passwordOk = user.password.length >= 6; // minimum 6 chars
    const buttonDisabled = !(usernameOk && emailOk && passwordOk);

    const onSignUp = async () => {
        //? Prevent form submission if validation fails or if already loading
        if (buttonDisabled || loading) return;

        try {
            // Set loading to true - this disables the button and shows loading state
            setLoading(true);
            
            //? Show a loading toast notification to user
            toast.loading("Creating your account...", { id: "signup" });
            
            // Make POST request to signup API endpoint with user data
            const response = await axios.post("/api/users/signup", user);
            
            // Log success response to console for debugging
            console.log("Signup Successful", response.data);
            
            // Dismiss the loading toast and show success message
            toast.success("Account created successfully!", { id: "signup" });
            
            // Navigate to login page after successful signup
            router.push("/login");
            
        } catch (error: any) {
            // Log error to console for debugging
            console.log("Sign Up Failed", error);
            
            // Dismiss loading toast and show error message to user
            // Check if error has response from server, otherwise show generic message
            toast.error(
                error?.response?.data?.error || "Signup failed. Please try again.", 
                { id: "signup" }
            );
            
        } finally {
            // Always set loading back to false when done (success or error)
            // This re-enables the button
            setLoading(false);
        }
    }


    return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center">
                    {/* Show "Processing" when loading, otherwise "Create Account" */}
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {loading ? "Processing..." : "Create Account"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Sign up to get started</p>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">Username</label>
                        <input 
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            id="username" 
                            type="text" 
                            value={user.username}
                            onChange={(e)=>{
                                setUser({...user, username: e.target.value});
                            }}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input 
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            id="email" 
                            type="email" 
                            value={user.email}
                            onChange={(e)=>{
                                setUser({...user, email: e.target.value});
                            }}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <input 
                                className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                id="password" 
                                type={showPassword ? "text" : "password"}
                                value={user.password}
                                onChange={(e)=>{
                                    setUser({...user, password: e.target.value});
                                }}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Button is disabled until inputs are valid OR while loading */}
                    <button
                        onClick={onSignUp}
                        disabled={buttonDisabled || loading} //? Disable if validation fails OR during API call
                        className={
                            buttonDisabled || loading //? Check both conditions for styling
                            ? "w-full bg-gray-300 dark:bg-gray-600 text-gray-500 font-semibold py-3 rounded-lg mt-6 cursor-not-allowed flex items-center justify-center gap-2"
                            : "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl mt-6 flex items-center justify-center gap-2"
                        }
                    >
                        {/* Show spinner icon when loading */}
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {/* Change button text based on loading state */}
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}