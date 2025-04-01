"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [router]);

    return <>{children}</>;
};

export default ProtectedRoute;
