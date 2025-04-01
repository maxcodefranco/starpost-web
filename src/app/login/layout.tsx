import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - Starpost",
    description: "Login to access your account",
};

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
