<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $programs = Program::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('admin/program/index', [
            'programs' => $programs,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return inertia('admin/program/create');
    }

    public function edit(int $id)
    {
        $program = Program::findOrFail($id);

        return inertia('admin/program/edit', [
            'program' => $program
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:programs,name',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|string',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();

        $data['image'] = $request->file('image')->store('programs', 'public');

        Program::create($data);

        return redirect()
            ->route('admin.program.index')
            ->with('success', 'Program berhasil ditambahkan.');
    }

    public function update(Request $request, int $id)
    {
        $program = Program::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:programs,name,' . $program->id,
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|string',
        ]);

        // Update slug kalau nama berubah
        if ($program->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        }

        // Replace image jika upload baru
        if ($request->hasFile('image')) {
            if ($program->image && Storage::disk('public')->exists($program->image)) {
                Storage::disk('public')->delete($program->image);
            }
            $data['image'] = $request->file('image')->store('programs', 'public');
        }

        $program->update($data);

        return redirect()
            ->route('admin.program.index')
            ->with('success', 'Program berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $program = Program::findOrFail($id);

        if ($program->image && Storage::disk('public')->exists($program->image)) {
            Storage::disk('public')->delete($program->image);
        }

        $program->delete();

        return redirect()
            ->route('admin.program.index')
            ->with('success', 'Program berhasil dihapus.');
    }
}
