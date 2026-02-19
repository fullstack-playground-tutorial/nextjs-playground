
"use client";

import { useState } from "react";
import FloatInput from "../components/FloatInput/FloatInput";
import ProfileIcon from "../components/Sidebar/icons/profile.svg";
import LanguageIcon from "../components/Sidebar/icons/language.svg";
import LogoutIcon from "../components/Sidebar/icons/logout.svg";
import SettingsIcon from "../components/Sidebar/icons/settings.svg";
import FilmIcon from "../components/Sidebar/icons/film.svg"; // Fallback for general
import Image from "next/image";

type Tab = "account" | "general";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const [formData, setFormData] = useState({
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
        phone: "0123456789",
        bio: "Software Engineer at NextJS Playground",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex h-full w-full flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-0/10 text-accent-0">
                    <SettingsIcon className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold dark:text-primary">Settings</h1>
            </div>

            <div className="flex flex-1 gap-8 overflow-hidden rounded-xl border border-border bg-surface-0 shadow-sm dark:border-border dark:bg-surface-1">
                {/* Settings Sidebar */}
                <div className="w-64 border-r border-border bg-surface-0 p-4 dark:border-border dark:bg-surface-1">
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveTab("account")}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === "account"
                                    ? "bg-accent-0 text-white shadow-md dark:shadow-accent-0/20"
                                    : "text-secondary hover:bg-surface-2 dark:text-secondary dark:hover:bg-surface-2"
                                }`}
                        >
                            <ProfileIcon className="h-5 w-5" />
                            Account Profile
                        </button>
                        {/* Future Link Placeholder */}
                        {/* <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary hover:bg-surface-2 dark:text-secondary dark:hover:bg-surface-2">
              <LanguageIcon className="h-5 w-5" />
              Preferences
            </button> */}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === "account" && (
                        <div className="mx-auto max-w-3xl space-y-10">

                            {/* Profile Header */}
                            <div className="flex items-center gap-6 pb-6 border-b border-border dark:border-border">
                                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-surface-0 shadow-lg dark:border-surface-2">
                                    {/* Placeholder Avatar */}
                                    <div className="flex h-full w-full items-center justify-center bg-accent-0 text-3xl font-bold text-white">
                                        N
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold dark:text-primary">Nguyen Van A</h2>
                                    <p className="text-secondary dark:text-secondary">Administrator</p>
                                    <button className="mt-2 text-sm font-medium text-accent-0 hover:underline">Change Avatar</button>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold dark:text-primary">Personal Information</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="h-14">
                                        <FloatInput
                                            name="fullName"
                                            label="Full Name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disable={false}
                                        />
                                    </div>
                                    <div className="h-14">
                                        <FloatInput
                                            name="bio"
                                            label="Bio (Job Title)"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            disable={false}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold dark:text-primary">Contact Information</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="h-14">
                                        <FloatInput
                                            name="email"
                                            label="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disable={false}
                                            type="email"
                                        />
                                    </div>
                                    <div className="h-14">
                                        <FloatInput
                                            name="phone"
                                            label="Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disable={false}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Security */}
                            <section className="space-y-4 pt-4 border-t border-border dark:border-border">
                                <h3 className="text-lg font-semibold dark:text-primary">Security</h3>

                                <div className="space-y-4 rounded-lg bg-surface-2/50 p-4 dark:bg-surface-0/50 border border-border dark:border-border">
                                    <h4 className="text-sm font-medium dark:text-primary">Change Password</h4>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="h-14">
                                            <FloatInput
                                                name="currentPassword"
                                                label="Current Password"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                disable={false}
                                                type="password"
                                            />
                                        </div>
                                        <div className="h-14">
                                            <FloatInput
                                                name="newPassword"
                                                label="New Password"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                disable={false}
                                                type="password"
                                            />
                                        </div>
                                        <div className="h-14">
                                            <FloatInput
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                disable={false}
                                                type="password"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="btn btn-sm btn-primary">Update Password</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-border p-4 dark:border-border dark:bg-surface-0/30">
                                    <div>
                                        <h4 className="text-sm font-medium dark:text-primary">Sessions</h4>
                                        <p className="text-xs text-secondary dark:text-secondary">Log out from all other devices.</p>
                                    </div>
                                    <button className="btn btn-sm text-alert-0 border border-alert-0 hover:bg-alert-0 hover:text-white transition-colors">
                                        Log out all devices
                                    </button>
                                </div>
                            </section>

                            {/* Preferences */}
                            <section className="space-y-4 pt-4 border-t border-border dark:border-border">
                                <h3 className="text-lg font-semibold dark:text-primary">Preferences</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-secondary">Language</label>
                                        <select className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm dark:border-border dark:text-primary focus:outline-none focus:ring-2 focus:ring-accent-0">
                                            <option value="en">English (US)</option>
                                            <option value="vi">Tiếng Việt</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section className="space-y-4 pt-8">
                                <div className="rounded-lg border border-alert-0/30 bg-alert-0/5 p-6 dark:bg-alert-0/10">
                                    <h3 className="text-lg font-semibold text-alert-0">Danger Zone</h3>
                                    <p className="mt-1 text-sm text-secondary dark:text-secondary">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <div className="mt-4">
                                        <button className="btn btn-md bg-alert-0 text-white hover:bg-alert-1 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}