"use client";

import { useState } from "react";
import FloatInput from "../../../components/FloatInput/FloatInput";
import { getLocaleService } from "@/app/utils/resource/locales";
import { useParams } from "next/navigation";

export default function AccountForm() {
  const params = useParams();
  const { localize } = getLocaleService(params.lang as string);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="flex items-center gap-6 pb-6 border-b border-border dark:border-border">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-surface-0 shadow-lg dark:border-surface-2">
          <div className="flex h-full w-full items-center justify-center bg-accent-0 text-3xl font-bold text-white">
            Name
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold dark:text-primary">Nguyen Van A</h2>
          <p className="text-secondary dark:text-secondary">
            {localize("settings_account_role_admin")}
          </p>
          <button className="mt-2 text-sm font-medium text-accent-0 hover:underline">
            {localize("settings_account_change_avatar")}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-primary">
          {localize("settings_account_personal_info")}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-14">
            <FloatInput
              name="fullName"
              label={localize("settings_account_full_name")}
              value={formData.fullName}
              onChange={handleChange}
              disable={false}
            />
          </div>
          <div className="h-14">
            <FloatInput
              name="bio"
              label={localize("settings_account_bio")}
              value={formData.bio}
              onChange={handleChange}
              disable={false}
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-primary">
          {localize("settings_account_contact_info")}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-14">
            <FloatInput
              name="email"
              label={localize("settings_account_email")}
              value={formData.email}
              onChange={handleChange}
              disable={false}
              type="email"
            />
          </div>
          <div className="h-14">
            <FloatInput
              name="phone"
              label={localize("settings_account_phone")}
              value={formData.phone}
              onChange={handleChange}
              disable={false}
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-4 pt-4 border-t border-border dark:border-border">
        <h3 className="text-lg font-semibold dark:text-primary">
          {localize("settings_account_security")}
        </h3>

        <div className="space-y-4 rounded-lg bg-surface-2/50 p-4 dark:bg-surface-0/50 border border-border dark:border-border">
          <h4 className="text-sm font-medium dark:text-primary">
            {localize("settings_account_change_password")}
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-14">
              <FloatInput
                name="currentPassword"
                label={localize("settings_account_current_password")}
                value={formData.currentPassword}
                onChange={handleChange}
                disable={false}
                type="password"
              />
            </div>
            <div className="h-14">
              <FloatInput
                name="newPassword"
                label={localize("settings_account_new_password")}
                value={formData.newPassword}
                onChange={handleChange}
                disable={false}
                type="password"
              />
            </div>
            <div className="h-14">
              <FloatInput
                name="confirmPassword"
                label={localize("settings_account_confirm_password")}
                value={formData.confirmPassword}
                onChange={handleChange}
                disable={false}
                type="password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-sm btn-primary">
              {localize("settings_account_update_password")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
