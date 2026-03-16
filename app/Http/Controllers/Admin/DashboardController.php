<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalEvents' => Event::count(),
            'totalParticipants' => Participant::count(),
            'totalPosts' => Post::count(),
        ];

        // Registration trend for the last 14 days
        $registrationTrend = Participant::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
            ->where('created_at', '>=', Carbon::now()->subDays(14))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        // Recent participants with event details
        $recentParticipants = Participant::with('event')
            ->latest()
            ->paginate(5);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'registrationTrend' => $registrationTrend,
            'recentParticipants' => $recentParticipants,
        ]);
    }
}
