import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Circle,
    Trash2,
    Plus,
    ListTodo,
    Sparkles,
    Check,
    Calendar,
    Flame,
    LayoutGrid,
    Clock,
    Edit3,
    X,
} from 'lucide-react';

/**
 * TaskItem Component
 * Renders an individual task item with toggle, edit, and delete functionality.
 */
function TaskItem({ task }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    // Toggle task completion status via PATCH request
    const handleToggle = () => {
        router.patch(
            `/tasks/${task.id}`,
            { is_done: !task.is_done },
            { preserveScroll: true }
        );
    };

    // Save inline edited title via PATCH request
    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editTitle.trim()) return;

        router.patch(
            `/tasks/${task.id}`,
            { title: editTitle.trim() },
            {
                preserveScroll: true,
                onSuccess: () => setIsEditing(false),
            }
        );
    };

    // Delete task via DELETE request
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            router.delete(`/tasks/${task.id}`, { preserveScroll: true });
        }
    };

    return (
        <li
            className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                task.is_done
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 text-slate-100'
            }`}
        >
            <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-3">
                {/* Checkbox Button */}
                <button
                    type="button"
                    onClick={handleToggle}
                    className={`shrink-0 transition-transform active:scale-90 focus:outline-none ${
                        task.is_done
                            ? 'text-emerald-400 hover:text-emerald-300'
                            : 'text-slate-500 hover:text-indigo-400'
                    }`}
                    title={task.is_done ? 'Mark as incomplete' : 'Mark as completed'}
                >
                    {task.is_done ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
                    ) : (
                        <Circle className="w-6 h-6 stroke-[1.75]" />
                    )}
                </button>

                {/* Task Title / Edit Form */}
                {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="flex items-center gap-2 flex-1">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus
                            className="w-full bg-slate-800 text-slate-100 px-3 py-1.5 rounded-lg border border-indigo-500 text-sm focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
                            title="Save"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setEditTitle(task.title);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition"
                            title="Cancel"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col flex-1 min-w-0">
                        <span
                            className={`text-sm md:text-base font-medium transition-all break-words ${
                                task.is_done
                                    ? 'line-through text-slate-500 decoration-slate-600'
                                    : 'text-slate-100'
                            }`}
                        >
                            {task.title}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {task.created_at
                                ? new Date(task.created_at).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : 'Just now'}
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {!isEditing && (
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 rounded-lg transition"
                        title="Edit title"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Delete task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
        </li>
    );
}

/**
 * Main Index Page Component
 * Laboratory Week 11: Task Manager with Inertia.js & React
 */
export default function Index({ tasks = [] }) {
    const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

    // Inertia form handling for creating tasks
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
    });

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!data.title.trim()) return;

        post('/tasks', {
            preserveScroll: true,
            onSuccess: () => reset('title'),
        });
    };

    // Calculate task metrics
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.is_done).length;
    const activeCount = totalCount - completedCount;
    const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Filter tasks
    const filteredTasks = tasks.filter((t) => {
        if (filter === 'active') return !t.is_done;
        if (filter === 'completed') return t.is_done;
        return true;
    });

    return (
        <>
            <Head title="Task Manager" />

            <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-between">
                {/* Main Content Area */}
                <div>
                    {/* Header Banner */}
                    <header className="mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>CCS112 • Week 11 Laboratory</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                                    <ListTodo className="w-8 h-8 text-indigo-400" />
                                    Task Manager
                                </h1>
                                <p className="text-sm text-slate-400 mt-1">
                                    Full-stack Task CRUD with Laravel 12, Eloquent ORM & Inertia React.
                                </p>
                            </div>

                            {/* Badge */}
                            <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
                                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-slate-400">Status</div>
                                    <div className="text-sm font-bold text-slate-200">
                                        {completedCount}/{totalCount} Completed
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {totalCount > 0 && (
                            <div className="mt-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                                    <span className="text-slate-400">Completion Progress</span>
                                    <span className="text-indigo-400">{percentDone}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                                        style={{ width: `${percentDone}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </header>

                    {/* Task Creation Form */}
                    <div className="mb-8">
                        <form
                            onSubmit={handleAddTask}
                            className="flex flex-col sm:flex-row gap-3 bg-slate-900/90 p-2.5 sm:p-3 rounded-2xl border border-slate-800 shadow-xl shadow-black/40"
                        >
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="What needs to be done?"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    disabled={processing}
                                    className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm md:text-base transition"
                                />
                                {errors.title && (
                                    <p className="text-xs text-rose-400 mt-1 pl-2">{errors.title}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing || !data.title.trim()}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{processing ? 'Adding...' : 'Add Task'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Filter Tabs & Counters */}
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                        <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setFilter('all')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                    filter === 'all'
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                All ({totalCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('active')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                    filter === 'active'
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                Active ({activeCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('completed')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                    filter === 'completed'
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                Completed ({completedCount})
                            </button>
                        </div>

                        <span className="text-xs text-slate-500">
                            Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                    </div>

                    {/* Task List */}
                    <main>
                        {filteredTasks.length > 0 ? (
                            <ul className="space-y-2.5">
                                {filteredTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-center">
                                <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                                    <Calendar className="w-7 h-7" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-300">
                                    {filter === 'completed'
                                        ? 'No completed tasks yet'
                                        : filter === 'active'
                                        ? 'No active tasks!'
                                        : 'No tasks found'}
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mt-1">
                                    {filter === 'all'
                                        ? 'Get started by creating your first task above.'
                                        : 'Try switching filters to view other tasks.'}
                                </p>
                            </div>
                        )}
                    </main>
                </div>

                {/* Laboratory Architecture Footer Note */}
                <footer className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
                    <p>
                        <strong className="text-slate-400">CCS112 Lab 3–5 Integration:</strong> Routes & Controller Actions (Lab 3) • Eloquent ORM Migrations & CRUD (Lab 4) • Inertia.js React SPA (Lab 5)
                    </p>
                    <p className="text-[11px] text-slate-600">
                        Laravel 12 Backend + SQLite + Inertia.js + React 19 + Vite
                    </p>
                </footer>
            </div>
        </>
    );
}
