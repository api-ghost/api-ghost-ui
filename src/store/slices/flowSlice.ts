import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from 'reactflow';
import { NodeEndPoint } from '@/pages/flow-canvas/types/endpointTypes';
interface Viewport {
  x: number;
  y: number;
  zoom: number;
}
interface FlowState {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}

const initialState: FlowState = { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setNodes(state, action: PayloadAction<Node[]>) {
      state.nodes = action.payload;
    },
    setEdges(state, action: PayloadAction<Edge[]>) {
      state.edges = action.payload;
    },
    updateNode: (state, action: PayloadAction<Node<NodeEndPoint>>) => {
      const idx = state.nodes.findIndex(n => n.id === action.payload.id);
      if (idx !== -1) state.nodes[idx] = action.payload;
    },
    resetFlow(state) {
      state.nodes = [];
      state.edges = [];
    },
  },
});

export const { setNodes, setEdges, resetFlow, updateNode } = flowSlice.actions;
export default flowSlice.reducer;
