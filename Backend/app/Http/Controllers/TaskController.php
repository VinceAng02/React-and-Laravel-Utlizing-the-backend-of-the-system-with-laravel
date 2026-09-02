<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Week 11 Laboratory: TaskController
 *
 * Lab 3: Define Routes and Implement Controller Actions for Requests
 * Lab 4: Perform CRUD Operations Using Migrations and Eloquent Models
 * Lab 5: Integrate Inertia.js to Render a Frontend Component with Laravel Backend Data
 */
class TaskController extends Controller
{
    /**
     * Display a listing of the tasks (Inertia frontend or JSON).
     */
    public function index(Request $request): Response|\Illuminate\Http\JsonResponse
    {
        $tasks = Task::latest()->get();

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($tasks);
        }

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Store a newly created task in storage.
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

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($task, 201);
        }

        return redirect()->back();
    }

    /**
     * Update the specified task in storage.
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

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($task);
        }

        return redirect()->back();
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Request $request, Task $task)
    {
        $task->delete();

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json(['message' => 'Task deleted successfully'], 200);
        }

        return redirect()->back();
    }
}
