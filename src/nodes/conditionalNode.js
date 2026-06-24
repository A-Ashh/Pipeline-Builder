// conditionalNode.js
//
// Demo node #4 — shows a node with ONE target handle and TWO source
// handles (true/false branches), demonstrating branching layouts.

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const ConditionalNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="Conditional"
      accent="#F87171"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-true`, style: { top: `${100 / 3}%` } },
        { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: `${200 / 3}%` } },
      ]}
    >
      <span>If condition is true → top, else → bottom.</span>
    </BaseNode>
  );
}
