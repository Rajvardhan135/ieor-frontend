"use client";
/*  eslint-disable */

import { useState } from "react";
import { Loader2, Lock, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { orgSignup } from "@/utils/api.utils";
import { useMutation } from "@tanstack/react-query";

export default function Signup() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const { mutate: login, isPending } = useMutation({
        mutationFn: (payload: { username: string, password: string }) => orgSignup(payload.username, payload.password),
        onSuccess: () => {
            console.log("Signup successful");
            router.push("/");
        },
        onError: (error) => {
            console.error("Login Error", error);
        },
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            return;
        }

        setIsSubmitting(true);
        login({ username, password });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
            <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden shadow-2xl">
                {/* Left Panel - Decorative */}
                <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 p-12 text-white relative">
                    <div className="absolute top-8 left-8 flex items-center gap-2">
                        <Image src="/icon.png" alt="logo" width={40} height={40} />
                        <h1 className="font-bold text-3xl">Safe Mark</h1>
                    </div>

                    <div className="h-full flex flex-col justify-center">
                        <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
                        <p className="text-xl opacity-90 mb-8">Create an account today and experience the future of shipment management.</p>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <div className="text-3xl mb-2">🔒</div>
                                <h3 className="font-bold mb-1">Secure Tracking</h3>
                                <p className="text-sm opacity-80">End-to-end encryption for all your shipping data</p>
                            </div>

                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <div className="text-3xl mb-2">⚡</div>
                                <h3 className="font-bold mb-1">Fast Delivery</h3>
                                <p className="text-sm opacity-80">Optimize routes for quicker deliveries</p>
                            </div>

                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <div className="text-3xl mb-2">📊</div>
                                <h3 className="font-bold mb-1">Analytics</h3>
                                <p className="text-sm opacity-80">Comprehensive reporting tools</p>
                            </div>

                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <div className="text-3xl mb-2">💼</div>
                                <h3 className="font-bold mb-1">Business Ready</h3>
                                <p className="text-sm opacity-80">Enterprise solutions for teams</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                </div>

                {/* Right Panel - Signup Form */}
                <div className="w-full md:w-1/2 bg-white px-8 py-12 flex flex-col items-center justify-center">
                    <div className="md:hidden flex items-center gap-2 mb-8">
                        <Image src="/icon.png" alt="logo" width={30} height={30} />
                        <h1 className="text-blue-800 font-bold text-2xl">Safe Mark</h1>
                    </div>

                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-blue-800 mb-1 text-center">Create Account</h2>
                        <p className="text-gray-500 mb-8 text-center">Join Safe Mark to streamline your shipments</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="pl-10 py-3 border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 py-3 border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-lg"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] font-medium text-base disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        <UserPlus className="h-5 w-5" />
                                        <span>Create Account</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?
                                <Link className="text-blue-700 font-medium hover:underline ml-1" href="/login">
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-500">
                                By creating an account, you agree to our
                                <a href="#" className="text-blue-600 hover:underline mx-1">Terms of Service</a>
                                and
                                <a href="#" className="text-blue-600 hover:underline mx-1">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}