import { useForm } from '@inertiajs/react'
import { Save, Image as ImageIcon, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import type { FormEvent, ChangeEvent } from 'react'

// Import Shadcn UI Components
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Event, RegistrationField } from '@/types/event'

interface EventFormData {
    _method?: 'put' | 'post'
    name: string
    description: string
    image: File | null
    registration_fields: RegistrationField[]
    status: 'open' | 'closed' | 'coming_soon'
    max_participants: number | ''
    is_public: boolean
    meta_title: string
    meta_description: string
    keywords: string
}

type Props = {
    event?: Event
    url: string
    method: 'post' | 'put'
}

export default function EventForm({ event, url, method }: Props) {
    const { data, setData, post, processing, errors } = useForm<EventFormData>({
        _method: method === 'put' ? 'put' : undefined,
        name: event?.name ?? '',
        description: event?.description ?? '',
        image: null,
        registration_fields: event?.registration_fields ?? [
            { name: 'Nama Lengkap', type: 'text', required: true }
        ],
        status: event?.status ?? 'coming_soon',
        max_participants: event?.max_participants ?? '',
        is_public: event?.is_public ?? true,
        meta_title: event?.meta_title ?? '',
        meta_description: event?.meta_description ?? '',
        keywords: event?.keywords ?? '',
    })

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setData('name', newName)
        if (!event) {
            setData('meta_title', newName.replace(/\s+/g, '-').toLowerCase())
        }
    }

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newDesc = e.target.value
        setData('description', newDesc)
        if (!event) {
            setData('meta_description', newDesc.substring(0, 160))
        }
    }

    const addField = () => {
        const newFields = [...data.registration_fields, { name: '', type: 'text', required: true } as RegistrationField]
        setData('registration_fields', newFields)
    }

    const removeField = (index: number) => {
        const newFields = data.registration_fields.filter((_, i) => i !== index)
        setData('registration_fields', newFields)
    }

    const updateField = (index: number, field: Partial<RegistrationField>) => {
        const newFields = [...data.registration_fields]
        newFields[index] = { ...newFields[index], ...field }
        setData('registration_fields', newFields)
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(url, {
            forceFormData: true,
            preserveScroll: true,
        })
    }

    return (
        <form onSubmit={submit} className="max-w-7xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {event ? 'Edit Event' : 'Create New Event'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Lengkapi informasi detail event, form pendaftaran, dan metadata SEO.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={processing}
                        className="flex-1 sm:flex-none hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-800 text-white flex-1 sm:flex-none shadow-md transition-all active:scale-95"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Event
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information */}
                    <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden">
                        <CardHeader className="border-b bg-gray-50/40">
                            <CardTitle className="text-lg font-bold text-gray-800">Informasi Umum</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name" className="text-gray-700 font-bold">Nama Event</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Webinar Cyber Security 2026"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        className={errors.name ? "border-red-500" : "focus:ring-2 focus:ring-gray-900"}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-gray-700 font-bold">Status Pendaftaran</Label>
                                    <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50/50">
                                        <Select 
                                            value={data.status} 
                                            onValueChange={(val: 'open' | 'closed') => setData('status', val)}
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="coming_soon">Coming Soon</SelectItem>
                                                <SelectItem value="open">Dibuka</SelectItem>
                                                <SelectItem value="closed">Ditutup</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label htmlFor="max_participants" className="text-gray-700 font-bold">Batas Peserta (Opsional)</Label>
                                    <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50/50">
                                        <Input
                                            id="max_participants"
                                            type="number"
                                            placeholder="Kosongkan jika tidak ada batas"
                                            value={data.max_participants}
                                            onChange={(e) => setData('max_participants', e.target.value === '' ? '' : parseInt(e.target.value))}
                                            className="bg-white"
                                        />
                                    </div>
                                    {errors.max_participants && <p className="text-xs text-red-500 font-medium">{errors.max_participants}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 font-bold">Deskripsi Event</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Jelaskan detail event, agenda, pembicara, dsb..."
                                    rows={6}
                                    value={data.description}
                                    onChange={handleDescriptionChange}
                                    className={errors.description ? "border-red-500" : "focus:ring-2 focus:ring-gray-900"}
                                />
                                {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dynamic Form Builder */}
                    <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden">
                        <CardHeader className="border-b bg-gray-50/40 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-gray-800">Form Pendaftaran Otomatis</CardTitle>
                                <CardDescription>Tentukan data yang wajib diisi oleh pendaftar.</CardDescription>
                            </div>
                            <Button type="button" onClick={addField} variant="outline" size="sm" className="bg-white hover:bg-gray-100 text-gray-900 font-bold border-gray-300">
                                <Plus className="w-4 h-4 mr-1.5" />
                                Tambah Field
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {data.registration_fields.map((field, index) => (
                                <div key={index} className="group relative flex flex-col md:flex-row gap-4 p-5 items-end border border-gray-200 rounded-xl bg-white hover:border-gray-400 transition-all shadow-sm hover:shadow-md">
                                    <div className="flex-1 w-full space-y-2">
                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Label Field</Label>
                                        <Input
                                            placeholder="Nama Lengkap / Instansi"
                                            value={field.name}
                                            onChange={(e) => updateField(index, { name: e.target.value })}
                                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div className="w-full md:w-40 space-y-2">
                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipe Form</Label>
                                        <Select 
                                            value={field.type} 
                                            onValueChange={(val: RegistrationField['type']) => updateField(index, { type: val })}
                                        >
                                            <SelectTrigger className="bg-gray-50/50 border-gray-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="number">Numeric</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="textarea">Paragraph</SelectItem>
                                                <SelectItem value="select">Dropdown</SelectItem>
                                                <SelectItem value="radio">Radio Button</SelectItem>
                                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full md:w-32 space-y-2">
                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest italic flex items-center justify-between">
                                            Required?
                                        </Label>
                                        <div className="flex items-center justify-center p-2 rounded-md border border-gray-100 bg-gray-50/50 h-10">
                                            <Switch 
                                                checked={field.required}
                                                onCheckedChange={(val) => updateField(index, { required: val })}
                                            />
                                        </div>
                                    </div>
                                    
                                    {(['select', 'radio', 'checkbox'].includes(field.type)) && (
                                        <div className="w-full md:col-span-3 space-y-2 mt-2 md:mt-0">
                                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opsi (Pisahkan dengan koma)</Label>
                                            <Input
                                                placeholder="Pilihan 1, Pilihan 2, Pilihan 3"
                                                value={field.options || ''}
                                                onChange={(e) => updateField(index, { options: e.target.value })}
                                                className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    )}

                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeField(index)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        disabled={data.registration_fields.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    {/* Media */}
                    <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="border-b bg-gray-50/40">
                            <CardTitle className="text-lg font-bold text-gray-800">Banner / Media</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 aspect-video flex items-center justify-center hover:border-gray-900 transition-all">
                                {event?.image && !data.image && (
                                    <img src={`/storage/${event.image}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                )}
                                <div className="z-10 text-center p-4">
                                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2 group-hover:text-gray-900" />
                                    <p className="text-xs font-bold text-gray-600">Klik untuk upload gambar</p>
                                </div>
                                <Input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer h-full"
                                    onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                />
                            </div>
                            {errors.image && <p className="text-xs text-red-500 font-bold">{errors.image}</p>}
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="border-b bg-gray-50/40">
                            <CardTitle className="text-lg font-bold text-gray-800">SEO & Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="meta_title" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Title (URL Slug)</Label>
                                <Input
                                    id="meta_title"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    className="bg-gray-50/50 focus:bg-white text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meta_description" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Description</Label>
                                <Textarea
                                    id="meta_description"
                                    rows={4}
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    className="bg-gray-50/50 focus:bg-white text-sm resize-none"
                                />
                                <p className="text-[10px] text-gray-400 px-1">Tulis ringkasan singkat untuk hasil pencarian Google.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
