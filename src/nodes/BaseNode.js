// BaseNode.js
import { Handle } from 'reactflow';
import './BaseNode.css';

/**
 * @param {string} id - node id, passed straight through from ReactFlow
 * @param {string} title - text shown in the node's title bar (e.g. "Input")
 * @param {Array} handles - array of handle configs:
 *    { type: 'source' | 'target', position: Position, id: string, style?: object }
 * @param {React.ReactNode} children - the node's body content (fields, labels, etc.)
 * @param {number|string} width - node width (defaults to 200, can grow for Text node)
 * @param {number|string} height - node height (defaults to 80, can grow for Text node)
 * @param {string} accent - hex color identifying this node TYPE (not instance).
 */
export const BaseNode = ({
  id,
  title,
  handles = [],
  children,
  width = 200,
  height = 80,
  accent = '#60A5FA',
}) => {
  return (
    <div
      className="base-node"
      style={{ width, height, '--accent': accent }}
    >
      <div className="base-node-edge" />
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          className="base-node-handle"
          style={handle.style}
        />
      ))}
      <div className="base-node-header">
        <span className="base-node-title">{title}</span>
      </div>
      <div className="base-node-body">
        {children}
      </div>
    </div>
  );
};
