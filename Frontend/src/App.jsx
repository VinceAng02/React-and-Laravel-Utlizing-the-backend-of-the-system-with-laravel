import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks from Laravel Backend
  const fetchTasks = async () => {
    try {
      setError(null);
      const response = await axios.get(API_URL, {
        headers: { Accept: 'application/json' },
      });
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Cannot connect to Laravel backend at http://127.0.0.1:8000. Make sure to run "php artisan serve" inside the Backend folder.');
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
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please check if Laravel backend is running.');
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
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Accept: 'application/json' },
      });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <p className="subtitle">CCS112 • Simple React & Laravel Application</p>

      {/* Backend Connection Warning if not running */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #f87171',
          color: '#b91c1c',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Backend Offline: </strong>
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTasks}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            Retry
          </button>
        </div>
      )}

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
