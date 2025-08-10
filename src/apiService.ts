import type { RecordItem } from "./record";

const API_URL = 'http://localhost:3000';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
}

export async function getRecords(): Promise<RecordItem[]> {
    return request<RecordItem[]>('/clients');
}

export async function getRecordedById(id: number): Promise<RecordItem> {
    return request<RecordItem>(`/clients/${id}`);
}

export async function createRecord(record: any): Promise<RecordItem> {
    return request<RecordItem>(`/clients`, {
        method: 'POST',
        body: JSON.stringify(record)
    });
}

export async function updateRecord(id: number, record: any): Promise<RecordItem> {
    return request<RecordItem>(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(record)
    });
}

export async function deleteRecord(id: number): Promise<RecordItem> {
    return request<RecordItem>(`/clients/${id}`, {
        method: 'DELETE'
    });
}

export default {
    getRecords,
    getRecordedById,
    createRecord,
    updateRecord,
    deleteRecord
};
