import { useForm } from '@inertiajs/react'
import { Save, Image as ImageIcon, ArrowLeft } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import type { Program } from '@/types/program'

// Definisi interface khusus untuk Form agar tidak pakai 'any'
interface ProgramFormData {
    _method?: 'put' | 'post'
    name: string
    description: string
    image: File | null
    meta_title: string
    meta_description: string
    keywords: string
}

type Props = {
    program?: Program
    url: string
    method: 'post' | 'put'
}

export default function ProgramForm({ program, url, method }: Props) {
    const { data, setData, post, processing, errors } = useForm<ProgramFormData>({
        _method: method === 'put' ? 'put' : undefined,
        name: program?.name ?? '',
        description: program?.description ?? '',
        image: null,
        meta_title: program?.meta_title ?? '',
        meta_description: program?.meta_description ?? '',
        keywords: program?.keywords ?? '',
    })

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        const seoFormatted = newName.replace(/\s+/g, '-').toLowerCase()

        setData((prevData) => ({
            ...prevData,
            name: newName,
            meta_title: seoFormatted,
        }))
    }

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newDesc = e.target.value
        setData((prevData) => ({
            ...prevData,
            description: newDesc,
            meta_description: newDesc.substring(0, 160),
        }))
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const options = {
            forceFormData: true,
            preserveScroll: true,
        }
        post(url, options)
    }

    return (
        <form onSubmit={submit} className="max-w-7xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {program ? 'Edit Program' : 'Create New Program'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Lengkapi informasi detail program dan metadata SEO secara tertata.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={processing}
                        className="flex-1 sm:flex-none"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-800 text-white flex-1 sm:flex-none shadow-sm"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Program
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="shadow-sm border-gray-200 rounded-xl">
                        <CardHeader className="border-b bg-gray-50/30">
                            <CardTitle className="text-lg">Informasi Umum</CardTitle>
                            <CardDescription>
                                Input data utama yang akan ditampilkan ke publik.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className={errors.name ? "text-red-500" : "text-gray-700 font-semibold"}>
                                    Nama Program
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan judul program..."
                                    value={data.name}
                                    onChange={handleNameChange}
                                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-gray-900"}
                                />
                                {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className={errors.description ? "text-red-500" : "text-gray-700 font-semibold"}>
                                    Deskripsi Lengkap
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tuliskan detail program di sini..."
                                    rows={10}
                                    value={data.description}
                                    onChange={handleDescriptionChange}
                                    className={`resize-none ${errors.description ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-gray-900"}`}
                                />
                                {errors.description && (
                                    <p className="text-xs font-medium text-red-500">{errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden">
                        <CardHeader className="border-b bg-gray-50/30">
                            <CardTitle className="text-lg">Media & Gambar</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <Label htmlFor="image" className={errors.image ? "text-red-500" : "text-gray-700 font-semibold"}>
                                    Banner / Cover Program
                                </Label>
                                <div className="flex flex-col md:flex-row items-center gap-8 p-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                    {program?.image && (
                                        <div className="w-48 h-32 rounded-lg border border-gray-200 overflow-hidden shadow-sm flex-shrink-0 bg-white">
                                            <img
                                                src={`/storage/${program.image}`}
                                                alt={program.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 w-full space-y-3">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                            className="bg-white cursor-pointer file:font-semibold file:text-gray-700"
                                        />
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            <span>Rasio 16:9 disarankan. Maksimum 2MB.</span>
                                        </div>
                                        {errors.image && <p className="text-xs font-medium text-red-500">{errors.image}</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="shadow-sm border-gray-200 rounded-xl sticky top-6 overflow-hidden">
                        <CardHeader className="border-b bg-gray-50/30">
                            <CardTitle className="text-lg">SEO Optimization</CardTitle>
                            <CardDescription>
                                Konfigurasi metadata untuk Google Search.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="meta_title" className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Meta Title (Slug)</Label>
                                <Input
                                    id="meta_title"
                                    type="text"
                                    placeholder="otomatis-terisi-slug"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                                <p className="text-[10px] text-gray-400 italic">Format URL ramah SEO menggunakan pemisah garis tengah.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meta_description" className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Meta Description</Label>
                                <Textarea
                                    id="meta_description"
                                    placeholder="Ringkasan konten untuk hasil pencarian..."
                                    rows={4}
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    className="resize-none bg-gray-50 border-gray-200 text-sm"
                                />
                                <p className="text-[10px] text-gray-400 italic">Maksimal 160 karakter untuk performa terbaik.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keywords" className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Target Keywords</Label>
                                <Input
                                    id="keywords"
                                    type="text"
                                    placeholder="koding, beasiswa, edukasi"
                                    value={data.keywords}
                                    onChange={(e) => setData('keywords', e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                                <p className="text-[10px] text-gray-400 italic">Pisahkan antar kata kunci dengan koma.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </form>
    )
}
