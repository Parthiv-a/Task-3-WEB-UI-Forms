import React, { useState } from 'react'
import { Table, Button, Space, Modal } from 'antd'
import type { Task } from '../types'
import TaskExecutionsModal from './TaskExecutionsModal'


export default function TaskList({ tasks, loading, onDelete, onEdit, onRun }:
{ tasks: Task[]; loading?: boolean; onDelete: (id: string)=>void; onEdit: (t: Task)=>void; onRun: (id: string)=>void }){


const [view, setView] = useState<Task | null>(null)


const cols = [
{ title: 'ID', dataIndex: 'id' },
{ title: 'Name', dataIndex: 'name', sorter: (a: Task,b: Task)=>a.name.localeCompare(b.name) },
{ title: 'Owner', dataIndex: 'owner' },
{ title: 'Command', dataIndex: 'command', render: (c: string) => <code style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth: 200, display:'inline-block'}}>{c}</code> },
{
title: 'Actions', key: 'actions', render: (_: any, row: Task) => (
<Space>
<Button onClick={()=>onEdit(row)} aria-label={`Edit ${row.name}`}>Edit</Button>
<Button onClick={()=>onRun(row.id)} aria-label={`Run ${row.name}`}>Run</Button>
<Button onClick={()=>setView(row)}>History</Button>
<Button danger onClick={()=>Modal.confirm({title: 'Delete task?', content: `Delete ${row.name}?`, onOk: ()=>onDelete(row.id) })}>Delete</Button>
</Space>
)
}
]


return (
<>
<Table columns={cols} dataSource={tasks.map(t=>({...t, key: t.id}))} loading={loading} pagination={{pageSize:10}} />
<TaskExecutionsModal task={view} onClose={()=>setView(null)} />
</>
)
}