// mathNode.js
//
// Demo node #2 — shows a node with TWO target handles and a numeric-ish
// operation field, demonstrating multi-handle layout via BaseNode.

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MathNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [operation, setOperation] = useState(data?.operation || 'add');

  const handleOperationChange = (e) => {
    const value = e.target.value;
    setOperation(value);
    updateNodeField(id, 'operation', value);
  };

  return (
    <BaseNode
      id={id}
      title="Math"
      accent="#FB923C"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-a`, style: { top: `${100 / 3}%` } },
        { type: 'target', position: Position.Left, id: `${id}-b`, style: { top: `${200 / 3}%` } },
        { type: 'source', position: Position.Right, id: `${id}-result` },
      ]}
    >
      <label>
        Operation:
        <select value={operation} onChange={handleOperationChange}>
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
      </label>
    </BaseNode>
  );
}
