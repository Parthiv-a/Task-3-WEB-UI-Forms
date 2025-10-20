import React, { useEffect } from 'react'
import { Form, Input, Button, Card } from 'antd'
import type { Task } from '../types'


export default function TaskForm({ task, onCancel, onSave } : { task: Task | null, onCancel: ()=>void, onSave: (t: Task)=>void }){
const [form] = Form.useForm()


useEffect(()=>{
if (task) form.setFieldsValue(task)
else form.resetFields()
}, [task])


if (!task) return (
<Card title="Task details" aria-live="polite">
<div style={{color:'#666'}}>Select a task from the list or click <strong>New Task</strong> to create one.</div>
</Card>
)


return (
<Card title={task.id ? 'Edit Task' : 'Create Task'}>
<Form form={form} layout="vertical" onFinish={(vals)=>{
const payload: Task = {...task, ...vals, id: vals.id || task.id || generateId() }
onSave(payload)
}}>
<Form.Item label="ID" name="id" rules={[{ required: true, message: 'Task ID is required' }]}>
<Input aria-label="Task ID" />
</Form.Item>
<Form.Item label="Name" name="name" rules={[{ required: true }]}> <Input aria-label="Task name" /> </Form.Item>
<Form.Item label="Owner" name="owner" rules={[{ required: true }]}> <Input aria-label="Task owner" /> </Form.Item>
<Form.Item label="Command" name="command" rules={[{ required: true, message: 'Command is required' }, { validator: validateCommand }]}> <Input aria-label="Shell command" /> </Form.Item>


<Form.Item>
<div style={{ display: 'flex', gap: 8 }}>
<Button htmlType="submit" type="primary">Save</Button>
<Button onClick={onCancel}>Cancel</Button>
</div>
</Form.Item>
</Form>
</Card>
)
}


function generateId(){
return Math.random().toString(36).slice(2,10)
}


function validateCommand(_: any, value: string){
if (!value) return Promise.reject('Required')
// Basic client-side check: disallow characters/constructs commonly used for injection (server must validate)
const forbidden = [';\n', '&&', '|', 'rm ', 'curl ', 'wget ', 'sudo ']
for (const f of forbidden) if (value.includes(f)) return Promise.reject(new Error('Command contains potentially unsafe token: ' + f))
return Promise.resolve()
}