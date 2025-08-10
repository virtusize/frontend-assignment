export interface RecordItem {
    id: number;
    gender: Gender | null | '';
    name: string;
    company: string;
    age: number | null;
    picture?: string;
    registered?: string;
    currency: string;
    subscriptionCost: number;
}

export enum Gender {
    Male = 0,
    Female = 1
}
