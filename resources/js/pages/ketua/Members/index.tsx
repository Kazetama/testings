import { Head, router, Link } from "@inertiajs/react";
import {
    MoreHorizontal,
    Plus,
    Search,
    Pencil,
    Trash2,
    UserCircle,
    FileSpreadsheet,
    Upload
} from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import type { Member, BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/ketua/dashboard' },
    { title: 'Members', href: '/ketua/members' }
];

export default function Index({ members }: { members: Member[] }) {
    const getStatusVariant = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'aktif' || lowerStatus === 'active') return 'default';
        if (lowerStatus === 'nonaktif' || lowerStatus === 'inactive') return 'destructive';
        return 'secondary';
    };

    const importInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null
    });

    const handleExport = () => {
        window.open('/ketua/members/export', '_blank');
    };

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            
            router.post('/ketua/members/import', formData, {
                onSuccess: () => {
                    if (importInputRef.current) importInputRef.current.value = '';
                }
            });
        }
    };

    const handleDelete = (id: string | number) => {
        if (confirm('Apakah Anda yakin ingin menghapus member ini?')) {
            router.delete(`/ketua/members/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Member" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Member</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola data anggota kepengurusan dan struktur organisasi.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="file" 
                            ref={importInputRef} 
                            onChange={handleFileChange} 
                            accept=".csv" 
                            className="hidden" 
                        />
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleImportClick}>
                            <Upload className="h-4 w-4" />
                            Import Excel
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                            <FileSpreadsheet className="h-4 w-4" />
                            Export Excel
                        </Button>
                        <Button size="sm" className="gap-2" asChild>
                            <Link href="/members/create">
                                <Plus className="h-4 w-4" />
                                Tambah Member
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>List Member</CardTitle>
                                <CardDescription>
                                    Menampilkan total {members.length} data member terdaftar.
                                </CardDescription>
                            </div>
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau NIM..."
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Nama & NIM</TableHead>
                                        <TableHead>Jabatan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                Tidak ada data member ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        members.map((m) => (
                                            <TableRow key={m.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>{m.full_name ?? "Tanpa Nama"}</span>
                                                            <span className="text-xs text-muted-foreground font-normal">
                                                                {m.nim}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{m.position ?? "-"}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getStatusVariant(m.status)}
                                                        className="capitalize"
                                                    >
                                                        {m.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => router.get(`/ketua/members/${m.id}/edit`)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Data
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(m.id)}
                                                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
