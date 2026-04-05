import React from "react";
import SeparatorRaw from "./separator.svg";
const Separator = SeparatorRaw as React.FC<React.SVGProps<SVGSVGElement>>;

export const BreadcrumbLoading = () => {
    return (
        <nav aria-label="Breadcrumb" className="w-full px-2 py-1">
            <ol className="flex items-center gap-2">
                <li className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-surface-2 rounded animate-pulse" />
                    <Separator className="size-4 opacity-20" />
                </li>
                <li className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-surface-2 rounded animate-pulse" />
                    <Separator className="size-4 opacity-20" />
                </li>
                <li className="flex items-center gap-2">
                    <div className="h-4 w-32 bg-surface-2 rounded animate-pulse" />
                </li>
            </ol>
        </nav>
    );
};

export default BreadcrumbLoading;