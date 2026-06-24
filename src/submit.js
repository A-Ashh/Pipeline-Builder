// submit.js

import { useStore } from './store';

const BACKEND_URL = 'http://localhost:8000';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    // Backend expects a Form field named "pipeline" containing a JSON
    // string of { nodes, edges } — matching the FastAPI signature
    // `pipeline: str = Form(...)`.
    const payload = JSON.stringify({ nodes, edges });
    const formData = new FormData();
    formData.append('pipeline', payload);

    try {
      const response = await fetch(`${BACKEND_URL}/pipelines/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();
      const { num_nodes, num_edges, is_dag } = result;

      alert(
        `Pipeline Summary\n\n` +
        `Number of Nodes: ${num_nodes}\n` +
        `Number of Edges: ${num_edges}\n` +
        `Is DAG: ${is_dag ? 'Yes' : 'No'}`
      );
    } catch (error) {
      alert(`Failed to parse pipeline: ${error.message}`);
    }
  };

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <button type="button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}