"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthPayload {
    username?: string;
    email?: string;
    [key: string]: unknown; // Permite propriedades adicionais
}

interface AuthContextType {
    payload: AuthPayload | null;
    token: string | null;
    setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [payload, setPayload] = useState<AuthPayload | null>(null);

    // Use localStorage to persist the token across page reloads
    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log({ storedToken })
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<AuthPayload>(token);
                console.log({ decoded });
                setPayload(decoded);
            } catch (error) {
                console.error("Invalid token:", error);
                setPayload(null);
            }
        } else {
            setPayload(null);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ payload, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
