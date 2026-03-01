import { Head, Link, router } from '@inertiajs/react'
import { Plus, Pencil, Trash2, Eye, MoreHorizontal, CheckCircle2, XCircle, Search, Inbox } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// Import Shadcn UI Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'

interface Program {
    id: number
    name: string
    description: string
    image: string
    meta_title?: string | null
    meta_description?: string | null
    keywords?: string | null
}

// Interface untuk Pagination bawaan Laravel
interface PaginatedData<T> {
    data: T[]
    links: { url: string | null; label: string; active: boolean }[]
    from: number
    to: number
    total: number
}

interface Props {
    programs: PaginatedData<Program>
    filters: { search?: string }
}

export default function Index({ programs, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '')
    const isFirstRender = useRef(true)

    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [programToDelete, setProgramToDelete] = useState<number | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        const timeoutId = setTimeout(() => {
            router.get(
                '/admin/program',
                { search: searchTerm },
                { preserveState: true, preserveScroll: true, replace: true }
            )
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const handleView = (program: Program) => {
        setSelectedProgram(program)
        setIsViewOpen(true)
    }

    const confirmDelete = (id: number) => {
        setProgramToDelete(id)
        setIsDeleteOpen(true)
    }

    const executeDelete = () => {
        if (programToDelete) {
            router.delete(`/admin/program/${programToDelete}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false)
                    setProgramToDelete(null)
                },
            })
        }
    }

    return (
        <AppLayout>
            <Head title="Program Management" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Program Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola daftar program, detail informasi, dan pantau kelengkapan SEO.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari nama atau deskripsi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full bg-white border-gray-300 focus-visible:ring-gray-900 rounded-lg shadow-sm"
                            />
                        </div>
                        <Button asChild className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white shadow-sm rounded-lg shrink-0">
                            <Link href="/admin/program/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Program
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/80 border-b border-gray-200">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[120px] pl-6 py-4 font-semibold text-gray-700">Cover</TableHead>
                                <TableHead className="font-semibold text-gray-700">Informasi Program</TableHead>
                                <TableHead className="hidden md:table-cell font-semibold text-gray-700 w-52">SEO Status</TableHead>
                                <TableHead className="w-[80px] text-center pr-6 font-semibold text-gray-700">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programs.data.length > 0 ? (
                                programs.data.map((program) => (
                                    <TableRow key={program.id} className="hover:bg-gray-50 group transition-colors border-b border-gray-100 last:border-0">
                                        {/* IMAGE */}
                                        <TableCell className="pl-6 py-4 align-top">
                                            <div className="w-24 h-16 rounded-md border border-gray-200 overflow-hidden bg-gray-50 shadow-sm">
                                                <img
                                                    src={`/storage/${program.image}`}
                                                    alt={program.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        </TableCell>

                                        {/* INFO */}
                                        <TableCell className="align-top py-4">
                                            <div className="space-y-1.5 max-w-lg">
                                                <span className="font-semibold text-gray-900 text-base leading-tight block">
                                                    {program.name}
                                                </span>
                                                <p className="text-sm text-gray-500 line-clamp-2 leading-snug">
                                                    {program.description}
                                                </p>
                                            </div>
                                        </TableCell>

                                        {/* SEO STATUS */}
                                        <TableCell className="hidden md:table-cell align-top py-4">
                                            <div className="flex flex-col gap-2 w-max">
                                                <Badge variant={program.meta_title ? "default" : "secondary"} className={`text-[11px] font-medium justify-start shadow-none ${program.meta_title ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}>
                                                    {program.meta_title ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <XCircle className="w-3.5 h-3.5 mr-1.5" />}
                                                    Meta Title
                                                </Badge>
                                                <Badge variant={program.meta_description ? "default" : "secondary"} className={`text-[11px] font-medium justify-start shadow-none ${program.meta_description ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}>
                                                    {program.meta_description ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <XCircle className="w-3.5 h-3.5 mr-1.5" />}
                                                    Meta Desc
                                                </Badge>
                                            </div>
                                        </TableCell>

                                        {/* ACTIONS */}
                                        <TableCell className="align-middle text-center pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-200 text-gray-500 data-[state=open]:bg-gray-200">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 shadow-lg rounded-xl border-gray-100">
                                                    <DropdownMenuLabel className="text-xs text-gray-400">Opsi Program</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleView(program)} className="cursor-pointer py-2">
                                                        <Eye className="mr-2 h-4 w-4 text-gray-500" />
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="cursor-pointer py-2">
                                                        <Link href={`/admin/program/${program.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                                                            Edit Program
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => confirmDelete(program.id)} className="text-red-600 cursor-pointer py-2 focus:text-red-700 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-72 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <div className="bg-gray-50 p-4 rounded-full mb-3 border border-gray-100">
                                                <Inbox className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-base font-medium text-gray-900">Tidak ada data ditemukan</p>
                                            <p className="text-sm mt-1">Coba sesuaikan kata kunci pencarian atau buat program baru.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* PAGINATION SECTION */}
                    {programs.links.length > 3 && (
                        <div className="bg-gray-50/50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500">
                                Menampilkan <span className="font-medium text-gray-900">{programs.from || 0}</span> sampai <span className="font-medium text-gray-900">{programs.to || 0}</span> dari <span className="font-medium text-gray-900">{programs.total}</span> total data
                            </p>

                            <div className="flex items-center gap-1 shadow-sm rounded-md border border-gray-200 overflow-hidden bg-white">
                                {programs.links.map((link, index) => {
                                    const label = link.label
                                        .replace('&laquo; Previous', '«')
                                        .replace('Next &raquo;', '»')

                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            className={`px-3 py-1.5 text-sm transition-colors border-r border-gray-200 last:border-r-0 ${
                                                link.active
                                                    ? 'bg-gray-900 text-white font-medium hover:bg-gray-800'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {label}
                                        </Link>
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 text-sm text-gray-300 bg-gray-50 cursor-not-allowed border-r border-gray-200 last:border-r-0"
                                        >
                                            {label}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL DIALOG (SHOW) */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl">
                    <div className="px-6 py-6 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{selectedProgram?.name}</DialogTitle>
                            <DialogDescription>
                                Detail lengkap informasi program dan metadata SEO.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedProgram && (
                            <div className="space-y-6">
                                <div className="w-full h-72 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shadow-inner">
                                    <img
                                        src={`/storage/${selectedProgram.image}`}
                                        alt={selectedProgram.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Description Box */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Deskripsi Program</h4>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 shadow-sm">
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                            {selectedProgram.description}
                                        </p>
                                    </div>
                                </div>

                                {/* SEO Box Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Meta Title</h4>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {selectedProgram.meta_title || <span className="italic text-gray-400 font-normal">Belum diisi</span>}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Meta Description</h4>
                                        <p className="text-sm text-gray-900">
                                            {selectedProgram.meta_description || <span className="italic text-gray-400 font-normal">Belum diisi</span>}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider sm:w-24">Keywords</h4>
                                        <p className="text-sm text-gray-900 flex-1">
                                            {selectedProgram.keywords || <span className="italic text-gray-400 font-normal">Belum diisi</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION ALERT */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Program Ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data program beserta gambar akan dihapus permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeDelete}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    )
}
