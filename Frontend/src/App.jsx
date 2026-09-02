import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all tasks from Laravel Backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Accept: 'application/json' },
      });
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        API_URL,
        { title: title.trim() },
        { headers: { Accept: 'application/json' } }
      );
      setTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task status
  const toggleTask = async (task) => {
    try {
      await axios.patch(
        `${API_URL}/${task.id}`,
        { is_done: !task.is_done },
        { headers: { Accept: 'application/json' } }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Accept: 'application/json' },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <p className="subtitle">CCS112 • Simple React & Laravel Application</p>

      {/* Task Creation Form */}
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          className="task-input"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="btn-add" disabled={loading || !title.trim()}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {/* Task List */}
      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={Boolean(task.is_done)}
                  onChange={() => toggleTask(task)}
                />
                <span className={`task-title ${task.is_done ? 'completed' : ''}`}>
                  {task.title}
                </span>
              </div>
              <button
                type="button"
                className="btn-delete"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-message">No tasks yet. Add a new task above!</p>
      )}
    </div>
  );
}
