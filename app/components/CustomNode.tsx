'use client';

import { Handle, Position } from 'reactflow';
import './custom-node.css';

export default function CustomNode({ data }: { data: { label: string } }) {
  return (
    <div className="n8n-node">
      <Handle type="target" position={Position.Left} className="n8n-handle" />
      <div className="n8n-content">
        <div className="n8n-icon">⚙️</div>
        <div className="n8n-label">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} className="n8n-handle" />
    </div>
  );
}
