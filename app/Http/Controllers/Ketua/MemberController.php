<?php

namespace App\Http\Controllers\Ketua;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Http\Requests\Ketua\MemberRequest;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('ketua/members/index', [
            'members' => Member::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('ketua/members/create');
    }

    public function store(MemberRequest $request)
    {
        Member::create($request->validated());

        return redirect()
            ->route('ketua.members.index')
            ->with('message', 'Member berhasil ditambahkan');
    }

    public function edit(Member $member)
    {
        return Inertia::render('ketua/members/edit', [
            'member' => $member
        ]);
    }

    public function update(MemberRequest $request, Member $member)
    {
        $member->update($request->validated());

        return redirect()
            ->route('ketua.members.index')
            ->with('message', 'Member berhasil diperbarui');
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return redirect()->back()
            ->with('message', 'Member berhasil dihapus');
    }

    public function export()
    {
        $members = Member::latest()->get();
        $headers = ['Nama Lengkap', 'NIM', 'No Telepon', 'Angkatan', 'Jabatan', 'Status'];

        $csv = \League\Csv\Writer::createFromFileObject(new \SplTempFileObject());
        $csv->insertOne($headers);

        foreach ($members as $member) {
            $csv->insertOne([
                $member->full_name,
                $member->nim,
                $member->phone,
                $member->batch,
                $member->position,
                $member->status,
            ]);
        }

        $filename = 'Data-Member-' . date('YmdHis') . '.csv';

        return response((string) $csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function import(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $csv = \League\Csv\Reader::createFromPath($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0);

        $records = $csv->getRecords();
        $importedCount = 0;
        $skippedCount = 0;

        foreach ($records as $record) {
            try {
                // Map headers to database columns
                // Using array_values if headers are not exact or specific names
                $data = [
                    'full_name' => $record['Nama Lengkap'] ?? $record['nama_lengkap'] ?? null,
                    'nim'       => $record['NIM'] ?? $record['nim'] ?? null,
                    'phone'     => $record['No Telepon'] ?? $record['no_telepon'] ?? $record['phone'] ?? null,
                    'batch'     => $record['Angkatan'] ?? $record['angkatan'] ?? $record['batch'] ?? null,
                    'position'  => $record['Jabatan'] ?? $record['jabatan'] ?? $record['position'] ?? null,
                    'status'    => strtolower($record['Status'] ?? $record['status'] ?? 'trial'),
                ];

                if (!$data['full_name'] || !$data['nim']) {
                    $skippedCount++;
                    continue;
                }

                // Check for duplicate NIM
                if (Member::where('nim', $data['nim'])->exists()) {
                    $skippedCount++;
                    continue;
                }

                Member::create($data);
                $importedCount++;
            } catch (\Exception $e) {
                $skippedCount++;
            }
        }

        return redirect()->back()
            ->with('success', "Berhasil mengimpor $importedCount member. $skippedCount data terlewati.");
    }
}
