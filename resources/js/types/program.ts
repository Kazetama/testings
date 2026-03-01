export interface Program {
    id: number
    name: string
    description: string
    image: string | null
    slug: string
    meta_title: string | null
    meta_description: string | null
    keywords: string | null
    created_at: string
    updated_at: string
}

export interface ProgramFormData {
    name: string
    description: string
    image: File | null
    meta_title: string
    meta_description: string
    keywords: string
}
