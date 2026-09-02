<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * TaskController for CCS112 Laboratory
 * Supports both standalone React (JSON API) and Inertia.js React frontend.
 */
class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index(Request $request)
    {
        $tasks = Task::latest()->get();

        // Render Inertia view for browser/Inertia requests
        if ($request->header('X-Inertia') || ($request->acceptsHtml() && !$request->wantsJson())) {
            return Inertia::render('Tasks/Index', [
                'tasks' => $tasks,
            ]);
        }

        // Return JSON for standard API / React fetch/axios requests
        return response()->json($tasks);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create([
            'title' => trim($validated['title']),
            'is_done' => false,
        ]);

        if ($request->header('X-Inertia')) {
            return redirect()->back();
        }

        return response()->json($task, 201);
    }

    /**
     * Update the specified task (toggle status or edit title).
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'is_done' => 'nullable|boolean',
            'title' => 'nullable|string|max:255',
        ]);

        if ($request->has('is_done')) {
            $task->is_done = $request->boolean('is_done');
        }

        if ($request->filled('title')) {
            $task->title = trim($validated['title']);
        }

        $task->save();

        if ($request->header('X-Inertia')) {
            return redirect()->back();
        }

        return response()->json($task);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Request $request, Task $task)
    {
        $task->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back();
        }

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
