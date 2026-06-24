
import { useState, useEffect, useRef, useMemo } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

const VARIABLE_PATTERN = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

const MIN_WIDTH = 200;
const MAX_WIDTH = 420;
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 360;
function extractVariables(text) {
  const seen = new Set();
  const names = [];
  let match;
  VARIABLE_PATTERN.lastIndex = 0;
  while ((match = VARIABLE_PATTERN.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
  }
  return names;
}

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setCurrText(value);
    updateNodeField(id, 'text', value);
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    el.style.width = 'auto';

    const contentHeight = el.scrollHeight;
    const nextHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, contentHeight + 70));
    const longestLine = currText.split('\n').reduce(
      (max, line) => Math.max(max, line.length),
      0
    );
    const nextWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longestLine * 7 + 60));

    setDimensions({ width: nextWidth, height: nextHeight });
  }, [currText]);
  const variableHandles = variables.map((name, index) => ({
    type: 'target',
    position: Position.Left,
    id: `${id}-${name}`,
    style: { top: `${((index + 1) / (variables.length + 1)) * 100}%` },
  }));

  const handles = [
    ...variableHandles,
    { type: 'source', position: Position.Right, id: `${id}-output` },
  ];

  return (
    <BaseNode
      id={id}
      title="Text"
      accent="#60A5FA"
      width={dimensions.width}
      height={dimensions.height}
      handles={handles}
    >
      <label>
        Text:
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          rows={1}
          style={{
            resize: 'none',
            overflow: 'hidden',
            width: '100%',
            fontFamily: 'inherit',
          }}
        />
      </label>
    </BaseNode>
  );
}