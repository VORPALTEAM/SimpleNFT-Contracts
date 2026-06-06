import type { ProjectServerResult } from './backend-types';

export class ProjectServerError extends Error {
    public readonly url: string;
    public readonly status?: number;

    constructor(url: string, message: string, status?: number) {
        super(message);
        this.name = 'ProjectServerError';
        this.url = url;
        this.status = status;
    }
}

export function normalizeHostname(hostname: string): string {
    return hostname.replace(/\/+$/, '');
}

export function buildUrl(hostname: string, path: string): string {
    const normalizedHost = normalizeHostname(hostname);
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedHost}${normalizedPath}`;
}

export async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new ProjectServerError(url, response.statusText || `HTTP ${response.status}`, response.status);
    }

    return (await response.json()) as T;
}

export async function getJsonResult<T>(url: string): Promise<ProjectServerResult<T>> {
    try {
        const data = await getJson<T>(url);

        return {
            ok: true,
            status: 'ok',
            url,
            data,
        };
    } catch (error) {
        const serverError = error instanceof ProjectServerError ? error : undefined;
        const httpStatus = serverError?.status;

        return {
            ok: false,
            status: httpStatus === 404 ? 'not_found' : 'request_failed',
            url,
            error: error instanceof Error ? error.message : String(error),
            httpStatus,
        };
    }
}
