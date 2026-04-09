"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CompanyPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push("/company/dashboard");
  }, [router]);

  return null;
};

export default CompanyPage;
