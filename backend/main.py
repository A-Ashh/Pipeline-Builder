from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_directed_acyclic_graph(nodes, edges):
    adjacency = {node['id']: [] for node in nodes}
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in adjacency:
            adjacency[source].append(target)

    state = {node['id']: 0 for node in nodes}

    def dfs(node_id):
        if state.get(node_id) == 1:
            return False
        if state.get(node_id) == 2:
            return True

        state[node_id] = 1
        for neighbor in adjacency.get(node_id, []):
            if not dfs(neighbor):
                return False
        state[node_id] = 2
        return True

    for node in nodes:
        if state[node['id']] == 0:
            if not dfs(node['id']):
                return False
    return True


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    data = json.loads(pipeline)
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])

    num_nodes = len(nodes)
    num_edges = len(edges)
    dag = is_directed_acyclic_graph(nodes, edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag
    }
