"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useAuthControllerRegister, useAuthControllerUpdateProfile } from "@/services/generated/api";
import axios from "axios";

interface FormData {
    username?: string;
    password?: string;
    termsAccepted?: boolean;
    photo?: File | null;
    profileData?: {
        bio?: string;
    };
}

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        termsAccepted: false,
        photo: null,
        profileData: {
            bio: "",
        },
    });

    const registerMutation = useAuthControllerRegister();
    const updateProfileMutation = useAuthControllerUpdateProfile();

    const handleNext = async () => {
        if (step === 1) {
            // Submit authentication data
            try {
                ''
                await registerMutation.mutateAsync({
                    data: {
                        username: formData.username || "",
                        password: formData.password || "",
                        termsAccepted: formData.termsAccepted || false,
                        profile: {
                            email: "",
                            firstName: "",
                            lastName: "",
                        }
                    },
                });
                setStep(step + 1);
            } catch (error) {
                console.error("Registration failed:", error);
            }
        } else if (step === 2) {
            // Submit photo upload
            if (formData.photo) {
                const formDataObj = new FormData();
                formDataObj.append("photo", formData.photo);

                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_HOST}/upload-photo`,
                        formDataObj,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    setStep(step + 1);
                } catch (error) {
                    console.error("Photo upload failed:", error);
                }
            } else {
                console.error("No photo selected");
            }
        } else if (step === 3) {
            // Submit profile data
            try {
                await updateProfileMutation.mutateAsync({
                    data: {
                        bio: formData?.profileData?.bio || "", // Ensure bio is passed correctly
                    },
                });
                console.log("Profile updated successfully");
            } catch (error) {
                console.error("Profile update failed:", error);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Step 1: Authentication</h2>
                        <div className="mb-4">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                placeholder="Enter your username"
                                className="mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                placeholder="Enter your password"
                                className="mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.termsAccepted}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            termsAccepted: e.target.checked,
                                        })
                                    }
                                    className="mr-2"
                                />
                                I accept the terms and conditions
                            </label>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Step 2: Upload Photo</h2>
                        <div className="mb-4">
                            <Label htmlFor="photo">Profile Photo</Label>
                            <Input
                                type="file"
                                id="photo"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        photo: e.target.files ? e.target.files[0] : null,
                                    })
                                }
                                className="mt-1"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Step 3: Profile Details</h2>
                        <div className="mb-4">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                type="text"
                                id="bio"
                                value={formData?.profileData?.bio}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        profileData: {
                                            ...formData.profileData,
                                            bio: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Tell us about yourself"
                                className="mt-1"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <Button onClick={handleBack} className="bg-gray-300">
                            Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button onClick={handleNext} className="bg-blue-500 text-white">
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleNext} className="bg-green-500 text-white">
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
