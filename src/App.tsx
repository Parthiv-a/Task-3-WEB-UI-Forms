import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, Button, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from './api';
import type { Task } from './types';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';


const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);

  async function loadAll() {
    setLoading(true);
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (e: any) {
      message.error('Failed to load tasks: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function onSearch(value: string) {
    setLoading(true);
    try {
      if (!value) {
        await loadAll();
        return;
      }
      const res = await api.findByName(value);
      setTasks(res);
    } catch (e: any) {
      message.error('Search failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(id: string) {
    try {
      await api.deleteTask(id);
      message.success('Deleted');
      await loadAll();
    } catch (e: any) {
      message.error('Delete failed: ' + e.message);
    }
  }

  async function onRun(id: string) {
    try {
      const task = await api.runTask(id);
      message.success('Execution started / stored');
      await loadAll();
      setSelected(task);
    } catch (e: any) {
      message.error('Run failed: ' + e.message);
    }
  }

  async function onSave(task: Task) {
    try {
      await api.putTask(task);
      message.success('Saved');
      setSelected(null);
      await loadAll();
    } catch (e: any) {
      message.error('Save failed: ' + e.message);
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>Task Runner — UI</Title>
          <Space>
            <Input.Search
              placeholder="Search tasks by name"
              allowClear
              onSearch={onSearch}
              style={{ width: 300 }}
              aria-label="Search tasks by name"
            />
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() =>
                setSelected({ id: '', name: '', owner: '', command: '', taskExecutions: [] })
              }
            >
              New Task
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: 16 }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 420px' }}>
          <TaskList
            tasks={tasks}
            loading={loading}
            onDelete={onRemove}
            onEdit={(t) => setSelected(t)}
            onRun={onRun}
          />

          <div aria-live="polite">
            <TaskForm task={selected} onCancel={() => setSelected(null)} onSave={onSave} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
