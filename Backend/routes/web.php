<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Task Manager (Week 11 Laboratory)
|--------------------------------------------------------------------------
|
| Lab 3 & Lab 5 Routes:
| GET    /tasks        -> Display task list via Inertia React component
| POST   /tasks        -> Store a newly created task
| PATCH  /tasks/{task} -> Update task status or title
| DELETE /tasks/{task} -> Delete task
|
*/

Route::redirect('/', '/tasks');

Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
