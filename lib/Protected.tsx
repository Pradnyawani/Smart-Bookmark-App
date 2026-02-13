"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login"); // If not logged in, redirect to login
      else setLoading(false); // If logged in, show the page
    });
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading while checking
  return <>{children}</>; // Show children content if logged in
}
