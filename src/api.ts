import type { Task } from './types';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

async function handleResp<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listTasks: async () => {
    const res = await fetch(`${BASE}/tasks`);
    return handleResp<Task[]>(res);
  },
  getTask: async (id: string) => {
    const res = await fetch(`${BASE}/tasks?id=${encodeURIComponent(id)}`);
    return handleResp<Task>(res);
  },
  findByName: async (q: string) => {
    const res = await fetch(`${BASE}/tasks/find?name=${encodeURIComponent(q)}`);
    return handleResp<Task[]>(res);
  },
  putTask: async (task: Task) => {
    const res = await fetch(`${BASE}/tasks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return handleResp<Task>(res);
  },
  deleteTask: async (id: string) => {
    const res = await fetch(`${BASE}/tasks?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResp<null>(res);
  },
  runTask: async (id: string) => {
    const res = await fetch(`${BASE}/tasks/${encodeURIComponent(id)}/executions`, {
      method: 'PUT',
    });
    return handleResp<Task>(res);
  },
};
