"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useOnboardingControllerUploadAvatar, useOnboardingControllerEditProfile } from '@/services/generated/api'; // Cliente gerado pelo Orval
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const router = useRouter();

    const uploadAvatarMutation = useOnboardingControllerUploadAvatar();
    const editProfileMutation = useOnboardingControllerEditProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bio) {
            alert('Please fill in the bio field.');
            return;
        }

        try {
            // Se o avatar foi fornecido, envie-o
            if (avatar) {
                const formData = new FormData();
                formData.append('avatar', avatar);

                await uploadAvatarMutation.mutateAsync({
                    data: {
                        avatar: formData.get('avatar') as Blob,
                    },
                });
            }

            // Envie a bio
            await editProfileMutation.mutateAsync(
                { data: { bio } },
                {
                    onSuccess: (data) => {
                        console.log('Response:', data);
                        router.push('/');
                    },
                    onError: (error) => {
                        console.error('Error submitting profile:', error);
                        alert('Failed to submit profile.');
                    },
                }
            );
        } catch (error) {
            console.error('Error during onboarding:', error);
            alert('An error occurred during onboarding.');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-center mb-4">Welcome to Starpost</h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Let&apos;s get started by setting up your account.
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField
                        id="avatar"
                        label="Avatar"
                        type="file"
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                    />
                    <TextareaField
                        id="bio"
                        label="Bio"
                        placeholder="Tell us a little about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        size="md"
                        className="w-full"
                        type="submit"
                        disabled={uploadAvatarMutation.isLoading || editProfileMutation.isLoading}
                    >
                        {uploadAvatarMutation.isLoading || editProfileMutation.isLoading
                            ? 'Submitting...'
                            : 'Get Started'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

function InputField({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
}: {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div>
            <Label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="mt-1"
            />
        </div>
    );
}

function TextareaField({
    id,
    label,
    placeholder,
    value,
    onChange,
}: {
    id: string;
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
    return (
        <div>
            <Label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
            </Label>
            <Textarea
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="mt-1"
            />
        </div>
    );
}

