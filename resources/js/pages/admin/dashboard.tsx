import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, Users, FileText, TrendingUp, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Stats {
    totalEvents: number;
    totalParticipants: number;
    totalPosts: number;
}

interface RegistrationTrend {
    date: string;
    count: number;
}

interface Participant {
    id: number;
    registration_data: Record<string, string | number | boolean | null>;
    created_at: string;
    event: {
        name: string;
    };
}

interface DashboardProps {
    stats: Stats;
    registrationTrend: RegistrationTrend[];
    recentParticipants: PaginatedData<Participant>;
}

export default function Dashboard({ stats, registrationTrend, recentParticipants }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50/50 dark:bg-transparent">

                {/* Stats Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="bg-white dark:bg-slate-900 border-none shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Events</CardTitle>
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold">{stats.totalEvents}</div>
                            <div className="flex items-center mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                Active & Upcoming
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-slate-900 border-none shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Participants</CardTitle>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold">{stats.totalParticipants}</div>
                            <div className="flex items-center mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                Total Registrations
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-slate-900 border-none shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Blog Posts</CardTitle>
                            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold">{stats.totalPosts}</div>
                            <div className="flex items-center mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                                Published Articles
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="col-span-1 shadow-sm border-none bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="border-b dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Registration Trends</CardTitle>
                                    <CardDescription>Visualizing growth over the last 14 days</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px] w-full pt-8 pl-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={registrationTrend} margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(str) => format(new Date(str), 'MMM d')}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#6366f1" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorCount)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 shadow-sm border-none bg-white dark:bg-slate-900 flex flex-col">
                        <CardHeader className="border-b dark:border-slate-800 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">Recent Participants</CardTitle>
                                    <CardDescription>Latest registrations across all events</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 flex flex-col">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                                        <TableRow className="hover:bg-transparent border-b dark:border-slate-800">
                                            <TableHead className="py-4 px-6 font-semibold text-xs tracking-wider uppercase opacity-70">Event Name</TableHead>
                                            <TableHead className="py-4 px-6 font-semibold text-xs tracking-wider uppercase opacity-70">Registration Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentParticipants.data.length > 0 ? (
                                            recentParticipants.data.map((p) => (
                                                <TableRow key={p.id} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <TableCell className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                                                        {p.event?.name || 'Deleted Event'}
                                                    </TableCell>
                                                    <TableCell className="py-4 px-6 text-slate-500 text-sm">
                                                        {format(new Date(p.created_at), 'PPP')}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-48 text-center p-0">
                                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                        <Inbox className="w-8 h-8 opacity-20" />
                                                        <span className="text-sm font-medium">No registrations yet</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Logic */}
                            {recentParticipants.links.length > 3 && (
                                <div className="mt-auto border-t dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        Showing <span className="font-semibold text-slate-900 dark:text-slate-200">{recentParticipants.from || 0}</span> to <span className="font-semibold text-slate-900 dark:text-slate-200">{recentParticipants.to || 0}</span> of <span className="font-semibold text-slate-900 dark:text-slate-200">{recentParticipants.total}</span>
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {recentParticipants.links.map((link, index) => {
                                            const label = link.label
                                                .replace('&laquo; Previous', '')
                                                .replace('Next &raquo;', '')
                                            
                                            const isArrow = link.label.includes('Previous') || link.label.includes('Next');
                                            const Icon = link.label.includes('Previous') ? ChevronLeft : ChevronRight;

                                            return link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    preserveScroll
                                                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-xs transition-all duration-200 border ${
                                                        link.active
                                                            ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm'
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 shadow-xs'
                                                    }`}
                                                >
                                                    {isArrow ? <Icon className="w-4 h-4" /> : label}
                                                </Link>
                                            ) : (
                                                <span
                                                    key={index}
                                                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-xs border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-900 cursor-not-allowed`}
                                                >
                                                    {isArrow ? <Icon className="w-4 h-4" /> : label}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
