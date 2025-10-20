import React from 'react'
import { Modal, Descriptions, List, Typography } from 'antd'
import type { Task } from '../types'


export default function TaskExecutionsModal({ task, onClose } : { task: Task | null, onClose: ()=>void }){
return (
<Modal open={!!task} title={task?.name} onCancel={onClose} footer={null} width={800}>
{task && (
<>
<Descriptions column={1}>
<Descriptions.Item label="ID">{task.id}</Descriptions.Item>
<Descriptions.Item label="Owner">{task.owner}</Descriptions.Item>
<Descriptions.Item label="Command"><code>{task.command}</code></Descriptions.Item>
</Descriptions>


<Typography.Title level={5}>Executions</Typography.Title>
<List dataSource={task.taskExecutions?.slice().reverse() ?? []} renderItem={item => (
<List.Item>
<List.Item.Meta
title={`${item.startTime} → ${item.endTime ?? 'running'}`}
description={<pre style={{whiteSpace:'pre-wrap', maxHeight:200, overflow:'auto'}}>{item.output ?? ''}</pre>}
/>
</List.Item>
)} />
</>
)}
</Modal>
)
}