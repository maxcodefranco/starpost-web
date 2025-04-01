"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

export default function HomePage() {
  const { payload } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
      <h1 className="text-3xl font-bold">
        Welcome {payload?.username ? payload.username : "Guest"}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-4">
        This is your personalized dashboard.
      </p>
    </div>
  );
}
