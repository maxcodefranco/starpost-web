"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); // Get the current path

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            // Redirect to login with returnUrl
            router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        } else {
            setIsAuthenticated(true);
        }
    }, [router, pathname]);

    if (!isAuthenticated) {
        return null; // Render nothing while checking authentication
    }

    return <>{children}</>;
}
