export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './program';

export interface Member {
    id: number;
    full_name: string;
    nim: string;
    phone: string;
    batch: number;
    position: string;
    status: 'aktif' | 'nonaktif' | 'trial' | 'demision';
    created_at?: string;
    updated_at?: string;
}
