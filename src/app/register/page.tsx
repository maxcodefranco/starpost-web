"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useAuthControllerRegister } from "@/services/generated/api";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const registerSchema = z.object({
    email: z.string().email("Invalid email address."),
    username: z.string().min(1, "Username is required."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    termsAccepted: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms." }),
    }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const router = useRouter();
    const registerMutation = useAuthControllerRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await registerMutation.mutateAsync({
                data: {
                    username: data.username,
                    password: data.password,
                    termsAccepted: data.termsAccepted,
                    profile: {
                        email: data.email,
                        firstName: data.firstName,
                        lastName: data.lastName,
                    },
                },
            });

            console.log("Registration successful:", response);

            router.push("/onboarding");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const handleOAuth = async (provider: string) => {
        try {
            console.log(`Redirecting to ${provider} OAuth...`);
            router.push("/onboarding");
        } catch (error) {
            console.error("OAuth failed:", error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            type="text"
                            id="username"
                            {...register("username")}
                            placeholder="Enter your username"
                            className={`mt-1 ${errors.username ? "border-red-500" : ""}`}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            type="text"
                            id="firstName"
                            {...register("firstName")}
                            placeholder="Enter your first name"
                            className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            type="text"
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Enter your last name"
                            className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                {...register("termsAccepted")}
                                className={`mr-2 ${errors.termsAccepted ? "border-red-500" : ""}`}
                            />
                            I accept the terms and conditions
                        </label>
                        {errors.termsAccepted && (
                            <p className="text-red-500 text-sm mt-1">{errors.termsAccepted.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-blue-500 text-white mb-4">
                        Register
                    </Button>
                </form>
                <div className="text-center text-gray-600 mb-4">or</div>
                <Button
                    onClick={() => handleOAuth("Google")}
                    className="w-full bg-red-500 text-white mb-2"
                >
                    Continue with Google
                </Button>
                <Button
                    onClick={() => handleOAuth("GitHub")}
                    className="w-full bg-gray-800 text-white"
                >
                    Continue with GitHub
                </Button>
            </div>
        </div>
    );
};

export default RegisterPage;
