<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Lab 3 & Lab 5: Test rendering the tasks page.
     */
    public function test_tasks_page_can_be_rendered(): void
    {
        Task::create(['title' => 'Sample Initial Task', 'is_done' => false]);

        $response = $this->get('/tasks');

        $response->assertStatus(200);
    }

    /**
     * Lab 4 & Lab 5: Test creating a task.
     */
    public function test_can_create_new_task(): void
    {
        $response = $this->post('/tasks', [
            'title' => 'Complete Laboratory 11',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'title' => 'Complete Laboratory 11',
            'is_done' => false,
        ]);
    }

    /**
     * Lab 4: Test updating task status.
     */
    public function test_can_toggle_task_is_done_status(): void
    {
        $task = Task::create([
            'title' => 'Study Eloquent and Inertia',
            'is_done' => false,
        ]);

        $response = $this->patch("/tasks/{$task->id}", [
            'is_done' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'is_done' => true,
        ]);
    }

    /**
     * Lab 4: Test deleting a task.
     */
    public function test_can_delete_task(): void
    {
        $task = Task::create([
            'title' => 'Temporary Task',
            'is_done' => false,
        ]);

        $response = $this->delete("/tasks/{$task->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }

    /**
     * Test validation.
     */
    public function test_title_is_required_to_create_task(): void
    {
        $response = $this->post('/tasks', [
            'title' => '',
        ]);

        $response->assertSessionHasErrors('title');
    }
}
