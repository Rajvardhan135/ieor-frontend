"use client";
/*  eslint-disable */

import { useState } from "react";
import { Loader2, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { orgLogin } from "@/utils/api.utils";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (payload: { username: string, password: string }) => orgLogin(payload.username, payload.password),
    onSuccess: () => {
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
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white relative">
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <Image src="/icon.png" alt="logo" width={40} height={40} />
            <h1 className="font-bold text-3xl">Safe Mark</h1>
          </div>

          <div className="h-full flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-6">Streamline Your Shipments</h2>
            <p className="text-xl opacity-90 mb-8">Efficient tracking, secure deliveries, and seamless logistics management in one place.</p>

            <div className="mt-10 bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <p className="italic text-white/80">"Safe Mark transformed our logistics operations. We've reduced delivery times by 30% and improved customer satisfaction."</p>
              <p className="mt-4 font-semibold">— Sarah Johnson, Logistics Manager</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 bg-white px-8 py-12 flex flex-col items-center justify-center">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <Image src="/icon.png" alt="logo" width={30} height={30} />
            <h1 className="text-blue-800 font-bold text-2xl">Safe Mark</h1>
          </div>

          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-blue-800 mb-1 text-center">Welcome Back</h2>
            <p className="text-gray-500 mb-8 text-center">Log in to access your dashboard</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 py-3 border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700 block">Password</label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 py-3 border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] font-medium text-base disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
              >
                {isPending ? (
                  <Loader2 className="animate-spin mx-auto h-5 w-5" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?
                <Link className="text-blue-700 font-medium hover:underline ml-1" href="/signup">
                  Create Account
                </Link>
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our
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