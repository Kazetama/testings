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
}
