"use client";

import { useRouter } from "next/navigation";
import BackArrow from "@/app/assets/images/icons/back_arrow.svg";

export default function BackButton() {
    const router = useRouter();

    return (
        <div
            className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer group-hover:dark:bg-orange-500"
            onClick={() => router.back()}
        >
            <BackArrow className="hover:underline group-hover:dark:fill-primary dark:fill-accent-0" />
        </div>
    );
}
