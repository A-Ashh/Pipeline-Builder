# Pipeline Builder

A visual, node-based pipeline builder — drag nodes onto a canvas, connect them, and validate the resulting graph. Built as a technical assessment, with a focus on making the node system genuinely extensible rather than just functional.

![Tech](https://img.shields.io/badge/frontend-React%20%2B%20ReactFlow-61DAFB)
![Tech](https://img.shields.io/badge/backend-FastAPI-009688)
![Tech](https://img.shields.io/badge/state-Zustand-orange)

---

## What it does

- Drag-and-drop nodes onto a canvas (Input, Output, LLM, Text, Filter, Math, API Call, Conditional, Delay)
- Connect nodes into a pipeline using typed handles
- Text nodes support `{{variableName}}` syntax — typing a variable name in double curly braces dynamically creates a new input handle on the node, and the node auto-resizes as content grows
- Submitting the pipeline sends its nodes/edges to a FastAPI backend, which returns the node count, edge count, and whether the graph is a valid **DAG** (directed acyclic graph)

## Why this is interesting

The actual engineering problem here isn't "render some boxes" — it's **avoiding the trap of copy-pasting a new component every time you need a new node type**. The four original node types (Input, Output, LLM, Text) shared almost all of their structure but were implemented as four separate, fully duplicated components.

This project solves that with a single `BaseNode` component that:

- Owns all shared rendering: the outer card, the title bar, connection handles, and styling
- Accepts a **declarative field schema** — `{ key, label, type, options }` — and renders the right input (text / select / checkbox) automatically, wiring it straight into global state
- Falls back to custom `children` only for nodes with genuinely special behavior (like the Text node's variable parsing)

The result: most new node types are now just a ~15-line config object, not a new component. Five additional node types (Filter, Math, API Call, Conditional, Delay) were added entirely through this schema — zero new render logic.

```js
// A complete, working node — this is the whole file.
export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    accent="#FBBF24"
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-input` },
      { type: 'source', position: Position.Right, id: `${id}-output` },
    ]}
    fields={[
      { key: 'condition', label: 'Condition', type: 'select', options: ['contains', 'equals', 'startsWith'] },
    ]}
  />
);
```

## Design

Dark "signal board" theme — each node type carries its own accent color (a thin top-edge bar + glowing handles), so connections visually trace back to the node type that emitted them, similar to wire colors in a circuit diagram.

| Node | Accent |
|---|---|
| Input | Green |
| Output | Pink |
| LLM | Violet |
| Text | Blue |
| Filter | Amber |
| Math | Orange |
| API Call | Cyan |
| Conditional | Red |
| Delay | Slate |

## Cycle detection

The backend validates the submitted graph using a standard three-color depth-first search (white / gray / black). If DFS revisits a node still marked "in progress" on the current path, that's a back-edge — a cycle — and the pipeline is correctly flagged as not a DAG.

```python
def is_directed_acyclic_graph(nodes, edges):
    adjacency = {node['id']: [] for node in nodes}
    for edge in edges:
        adjacency[edge['source']].append(edge['target'])

    state = {node['id']: 0 for node in nodes}  # 0=unvisited, 1=visiting, 2=done

    def dfs(node_id):
        if state[node_id] == 1: return False   # back-edge -> cycle
        if state[node_id] == 2: return True
        state[node_id] = 1
        for neighbor in adjacency.get(node_id, []):
            if not dfs(neighbor):
                return False
        state[node_id] = 2
        return True

    return all(dfs(n['id']) for n in nodes if state[n['id']] == 0)
```

## Project structure

```
.
├── backend/
│   └── main.py          # FastAPI app: /pipelines/parse endpoint, DAG check
└── frontend/
    └── src/
        ├── nodes/
        │   ├── BaseNode.js     # shared abstraction (rendering + state wiring)
        │   ├── BaseNode.css    # shared node styling
        │   ├── inputNode.js
        │   ├── outputNode.js
        │   ├── llmNode.js
        │   ├── textNode.js     # custom: variable parsing + auto-resize
        │   ├── filterNode.js
        │   ├── mathNode.js
        │   ├── apiNode.js
        │   ├── conditionalNode.js
        │   └── delayNode.js
        ├── ui.js          # ReactFlow canvas + node type registry
        ├── toolbar.js     # draggable node palette
        ├── submit.js      # posts pipeline to backend, shows result
        ├── store.js       # Zustand store (nodes, edges, field updates)
        └── App.js / App.css
```

## Running locally

**Backend**
```bash
cd backend
pip install fastapi uvicorn python-multipart
uvicorn main:app --reload
```
Runs on `http://127.0.0.1:8000`.
<img width="1101" height="582" alt="image" src="https://github.com/user-attachments/assets/de59edca-4e7e-4fb8-bbd6-68bddbd449ed" />


**Frontend**
```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000`.
<img width="1152" height="598" alt="image" src="https://github.com/user-attachments/assets/fd0d1f51-d17b-4f8a-af27-dfcf8c1e69ec" />
<img width="1102" height="595" alt="image" src="https://github.com/user-attachments/assets/1f0cab01-bdbb-4db0-b823-b3dc74bd04a1" />


Both need to be running simultaneously — the frontend posts pipeline data to the backend on Submit.

## Stack

- **Frontend:** React, [ReactFlow](https://reactflow.dev/), Zustand
- **Backend:** FastAPI, Python
