// filterNode.js
//
// Demo node #1 — shows a simple 1-in/1-out node with a dropdown field.

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || 'contains');

  const handleConditionChange = (e) => {
    const value = e.target.value;
    setCondition(value);
    updateNodeField(id, 'condition', value);
  };

  return (
    <BaseNode
      id={id}
      title="Filter"
      accent="#FBBF24"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-output` },
      ]}
    >
      <label>
        Condition:
        <select value={condition} onChange={handleConditionChange}>
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
        </select>
      </label>
    </BaseNode>
  );
}
