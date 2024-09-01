export interface Filter {
    size?: number;
    limit?: number;
    sort?: string;
    q?: string;
    page?: number;
}

export interface BaseSearchService<T,F> {
    search(filter: F, userAgent: string, ip: string, deviceId: string): Promise<T[]>
}