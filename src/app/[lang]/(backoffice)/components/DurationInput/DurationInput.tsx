"use client"

import { useEffect, useState } from "react";

type Props = {
    name: string;
    label: string;
    disable: boolean;
    required?: boolean;
    duration?: number;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        value: number,
    ) => void;
};

function DurationInput({ onChange, duration, label, name, disable, required }: Props) {
    const [state, setState] = useState<{
        hours: string;
        minutes: string;
        seconds: string;
    }>({
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        type: "hours" | "minutes" | "seconds"
    ) => {
        const { value } = e.target;
        const regex = /^[0-9]*$/;
        if (!regex.test(value)) {
            return;
        }
        if (type === "hours") {
            if (Number(value) > 23 || state.hours == value) {
                return;
            }
            const computedValue = Number(value) * 3600 + Number(state.minutes) * 60 + Number(state.seconds);
            onChange(e, computedValue);
            setState((prev) => ({
                ...prev,
                hours: value,
            }));
        } else if (type === "minutes" || type === "seconds") {
            if (Number(value) > 59 || (type === "minutes" && state.minutes == value) || (type === "seconds" && state.seconds == value)) {
                return;
            }

            const computedValue = type === "minutes" ? Number(state.hours) * 3600 + Number(value) * 60 + Number(state.seconds) : Number(state.hours) * 3600 + Number(state.minutes) * 60 + Number(value);
            onChange(e, computedValue);
            setState((prev) => ({
                ...prev,
                [type]: value,
            }));
        }
    };
    const pad = (n: number) => n.toString().padStart(2, "0");

    useEffect(() => {
        if (duration !== undefined) {
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = duration % 60;
            setState({
                hours: pad(hours),
                minutes: pad(minutes),
                seconds: pad(seconds),
            });
        }
    }, [duration]);

    return (
        <div className="relative w-full h-full flex items-center gap-2">
            <label
                htmlFor={name}
                className="absolute left-3 top-1.5 text-sm font-medium transition-all duration-200text-secondary peer-focus:text-sm peer-focus:font-normal dark:peer-focus:text-accent-0"
            >
                {label}{required && <span className="text-alert-0">*</span>}
            </label>
            <div className="flex items-center gap-2 flex-row">
                <input
                    disabled={disable}
                    type="text"
                    id={`${name}-hours`}
                    name={`${name}-hours`}
                    value={state.hours}
                    maxLength={2}
                    placeholder="HH"
                    onChange={(e) => handleChange(e, "hours")}
                    className="peer w-full h-full leading-5 rounded-md border dark:border-border dark:bg-surface-1
        px-3 pt-6 pb-2 text-sm dark:text-primary placeholder-transparent
        dark:focus:border-border-strong dark:focus:ring dark:focus:ring-accent-0 outline-none transition-all duration-200 shadow"
                />
                <input
                    disabled={disable}
                    type="text"
                    id={`${name}-minutes`}
                    name={`${name}-minutes`}
                    value={state.minutes}
                    maxLength={2}
                    placeholder="MM"
                    onChange={(e) => handleChange(e, "minutes")}
                    className="peer w-full h-full leading-5 rounded-md border dark:border-border dark:bg-surface-1
        px-3 pt-6 pb-2 text-sm dark:text-primary placeholder-transparent
        dark:focus:border-border-strong dark:focus:ring dark:focus:ring-accent-0 outline-none transition-all duration-200 shadow"
                />
                <input
                    disabled={disable}
                    type="text"
                    id={`${name}-seconds`}
                    name={`${name}-seconds`}
                    value={state.seconds}
                    maxLength={2}
                    placeholder="SS"
                    onChange={(e) => handleChange(e, "seconds")}
                    className="peer w-full h-full leading-5 rounded-md border dark:border-border dark:bg-surface-1
        px-3 pt-6 pb-2 text-sm dark:text-primary placeholder-transparent
        dark:focus:border-border-strong dark:focus:ring dark:focus:ring-accent-0 outline-none transition-all duration-200 shadow"
                />
            </div>

        </div>
    );
}

export default DurationInput;
