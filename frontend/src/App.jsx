import { useCallback, useEffect, useState } from "react";
import TaskForm from "./TaskForm.jsx";
import TaskList from "./TaskList.jsx";
import {
  createTask,
  deleteTask,
  finalizeTask,
  getTasks,
  updateTask,
} from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleSubmit(form) {
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updateTask(editing.id, form);
        setMessage("Tarea actualizada");
        setEditing(null);
      } else {
        await createTask(form);
        setMessage("Tarea creada");
      }
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(
      `¿Eliminar la tarea "${task.resumen}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    try {
      await deleteTask(task.id);
      if (editing?.id === task.id) setEditing(null);
      setMessage("Tarea eliminada");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFinalize(task) {
    try {
      await finalizeTask(task.id);
      setMessage("Tarea finalizada");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="layout">
      <header>
        <h1>Gestor de tareas de proyectos de software</h1>
        <p className="subtitle">
          Alta, edición, cierre y seguimiento de tickets con persistencia en
          PostgreSQL.
        </p>
      </header>

      {message && (
        <div className="alert success" role="status">
          {message}
          <button type="button" onClick={() => setMessage(null)}>
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="alert error" role="alert">
          {error}
          <button type="button" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <TaskForm
        initialTask={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
        saving={saving}
      />

      <TaskList
        tasks={tasks}
        onEdit={setEditing}
        onDelete={handleDelete}
        onFinalize={handleFinalize}
      />
    </div>
  );
}
