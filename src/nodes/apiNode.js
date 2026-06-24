// apiNode.js
//
// Demo node #3 — shows a node with a free-text field (URL) plus a
// dropdown for HTTP method, single in/out handles.

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const APINode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    updateNodeField(id, 'url', value);
  };

  const handleMethodChange = (e) => {
    const value = e.target.value;
    setMethod(value);
    updateNodeField(id, 'method', value);
  };

  return (
    <BaseNode
      id={id}
      title="API Call"
      accent="#38BDF8"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-response` },
      ]}
    >
      <label>
        URL:
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://api.example.com"
        />
      </label>
      <label>
        Method:
        <select value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </BaseNode>
  );
}
