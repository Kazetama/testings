<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventRequest;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use League\Csv\Writer;
use SplTempFileObject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('admin/event/index', [
            'events' => $events,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return inertia('admin/event/create');
    }

    public function edit(int $id)
    {
        $event = Event::findOrFail($id);

        return inertia('admin/event/edit', [
            'event' => $event
        ]);
    }

    public function store(EventRequest $request)
    {
        $data = $request->validated();

        $data['image'] = $request->file('image')->store('events', 'public');

        Event::create($data);

        return redirect()
            ->route('admin.event.index')
            ->with('success', 'Event berhasil ditambahkan.');
    }

    public function update(EventRequest $request, int $id)
    {
        $event = Event::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($event->image && Storage::disk('public')->exists($event->image)) {
                Storage::disk('public')->delete($event->image);
            }
            $data['image'] = $request->file('image')->store('events', 'public');
        } else {
            unset($data['image']);
        }

        $event->update($data);

        return redirect()
            ->route('admin.event.index')
            ->with('success', 'Event berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $event = Event::findOrFail($id);

        if ($event->image && Storage::disk('public')->exists($event->image)) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return redirect()
            ->route('admin.event.index')
            ->with('success', 'Event berhasil dihapus.');
    }

    public function participants(Event $event)
    {
        $participants = $event->participants()->latest()->paginate(20);

        return Inertia::render('admin/event/participants', [
            'event' => $event,
            'participants' => $participants
        ]);
    }

    public function export(Event $event)
    {
        $participants = $event->participants()->latest()->get();
        $fields = $event->registration_fields ?? [];

        // Extract headers from registration_fields
        $headers = collect($fields)->pluck('name')->toArray();
        array_unshift($headers, 'No', 'Tanggal Daftar');

        $csv = Writer::createFromFileObject(new SplTempFileObject());
        $csv->insertOne($headers);

        foreach ($participants as $index => $participant) {
            $data = $participant->registration_data;
            $row = [
                $index + 1,
                $participant->created_at->format('Y-m-d H:i:s'),
            ];

            foreach ($fields as $field) {
                $fieldName = str_replace(' ', '_', strtolower($field['name']));
                $row[] = $data[$fieldName] ?? '-';
            }

            $csv->insertOne($row);
        }

        $filename = 'Participants-' . str_replace(' ', '-', $event->name) . '-' . date('YmdHis') . '.csv';

        return response((string) $csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
