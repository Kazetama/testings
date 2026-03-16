export interface Event {
    id: number
    name: string
    slug: string
    description: string
    image: string
    registration_fields: RegistrationField[] | null
    status: 'open' | 'closed' | 'coming_soon'
    max_participants: number | null
    participants_count?: number
    is_public: boolean
    meta_title: string | null
    meta_description: string | null
    keywords: string | null
    created_at: string
    updated_at: string
}

export interface RegistrationField {
    name: string
    type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox'
    required: boolean
    options?: string
}
