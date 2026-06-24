// delayNode.js
//
// Demo node #5 — shows a node with a checkbox field alongside a text
// field, single in/out handles.

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [seconds, setSeconds] = useState(data?.seconds || '1');
  const [repeat, setRepeat] = useState(data?.repeat || false);

  const handleSecondsChange = (e) => {
    const value = e.target.value;
    setSeconds(value);
    updateNodeField(id, 'seconds', value);
  };

  const handleRepeatChange = (e) => {
    const checked = e.target.checked;
    setRepeat(checked);
    updateNodeField(id, 'repeat', checked);
  };

  return (
    <BaseNode
      id={id}
      title="Delay"
      accent="#94A3B8"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-output` },
      ]}
    >
      <label>
        Seconds:
        <input
          type="text"
          value={seconds}
          onChange={handleSecondsChange}
        />
      </label>
      <label>
        Repeat:
        <input
          type="checkbox"
          checked={repeat}
          onChange={handleRepeatChange}
        />
      </label>
    </BaseNode>
  );
}
