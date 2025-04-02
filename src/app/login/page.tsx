"use client";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import React, { useState, Suspense } from 'react';
import { useAuthControllerLogin } from '@/services/generated/api';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const loginMutation = useAuthControllerLogin<LoginResponse>(); // Specify the response type
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(null); // Reset error state
        try {
            const response = await loginMutation.mutateAsync({
                data: { username, password }, // Envia os dados corretamente
            });

            // Store tokens in localStorage
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            console.log('Login successful:', response);

            // Redirect to returnUrl or default to home
            const searchParams = new URLSearchParams(window.location.search);
            const returnUrl = searchParams.get('returnUrl') || '/';
            router.push(returnUrl);
        } catch (error: unknown) {
            console.error('Login failed:', error);
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                error={error}
                handleLogin={handleLogin}
                isLoading={loginMutation.isLoading}
            />
        </Suspense>
    );
};

const LoginContent = ({
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin,
    isLoading,
}: {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    error: string | null;
    handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}) => {
    return (
        <div className="flex h-screen">
            <div
                className="w-1/2 h-full bg-cover bg-center"
                style={{ backgroundImage: 'url(/pages/login/background.png)' }}
            />
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center">Login</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="mt-1"
                                />
                            </div>
                            <div className="mb-6">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="mt-1"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="text-center">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
