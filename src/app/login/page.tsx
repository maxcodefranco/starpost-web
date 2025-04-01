"use client";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import { useAuthControllerLogin } from '@/services/generated/api';
import { useSearchParams, useRouter } from 'next/navigation';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const loginMutation = useAuthControllerLogin<LoginResponse>(); // Specify the response type
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error state
        try {
            const response = await loginMutation.mutateAsync({
                data: { username, password },
            });

            // Store tokens in localStorage
            localStorage.setItem('accessToken', (response.data as any).accessToken);
            localStorage.setItem('refreshToken', (response.data as any).refreshToken);

            console.log('Login successful:', response);

            // Redirect to returnUrl or default to home
            const returnUrl = searchParams.get('returnUrl') || '/';

            router.push(returnUrl);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid username or password. Please try again.');
        }
    };

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
                        <form onSubmit={handleSubmit}>
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
                                disabled={loginMutation.isLoading}
                            >
                                {loginMutation.isLoading ? 'Logging in...' : 'Login'}
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
