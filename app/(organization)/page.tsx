"use client";

import { useOrgDetails } from "@/hooks/useOrgDetails";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { saveOrgContact } from "@/utils/api.utils";

function OrgDetailsPage() {
  const { data, error, isLoading } = useOrgDetails();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  useEffect(() => {
    console.log(data)
    if (data && data.data.organizationContact?.email) {
      router.push("/home"); // Redirect to home if contactDetails exists
    } else if (data) {
      setShowEmailPrompt(true);
    }
  }, [data, router]);

  const { mutate: saveContact } = useMutation({
    mutationFn: saveOrgContact,
    onSuccess: () => {
      router.push("/home");
    },
    onError: (error) => {
      console.error("Error saving contact:", error);
    },
  });

  const handleEmailSubmit = () => {
    if (email.trim() !== "") {
      console.log("Email submitted:", email);
      saveContact(email);
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {showEmailPrompt ? (
        <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Enter Your Email</h2>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white mt-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleEmailSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        <p className="text-gray-600 text-center">Redirecting...</p>
      )}
    </div>
  );
}

export default OrgDetailsPage;
