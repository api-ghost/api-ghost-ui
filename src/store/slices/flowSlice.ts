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

    toggleShowBody: (state, action: PayloadAction<string>) => {
      const node = state.nodes.find(n => n.id === action.payload);
      if (node && node.data) {
        node.data = {
          ...node.data,
          showBody: !node.data.showBody,
        };
      }
    },

    setShowBodyVisibility(state, action: PayloadAction<{ nodeId: string; visible: boolean }>) {
      const node = state.nodes.find(n => n.id === action.payload.nodeId);
      if (node?.data) {
        node.data = {
          ...node?.data,
          showBody: action.payload.visible,
        };
      }
    },

    updateNodePath: (state, action: PayloadAction<{ nodeId: string; path: string }>) => {
      const { nodeId, path } = action.payload;
      const node = state.nodes.find(n => n.id === nodeId);
      if (node && node.data) {
        node.data = {
          ...node.data,
          path,
        };
      }
    },
    updateNodeSchema: (
      state,
      action: PayloadAction<{
        nodeId: string;
        requestSchema: string;
        responseSchema: string;
        header?: string;
      }>,
    ) => {
      const { nodeId, requestSchema, responseSchema, header } = action.payload;
      const node = state.nodes.find(n => n.id === nodeId);
      if (node && node.data) {
        node.data = {
          ...node.data,
          requestSchema,
          responseSchema,
          header: header ?? node.data.header,
          showBody: false,
        };
      }
    },
  },
});

export const {
  setNodes,
  setEdges,
  resetFlow,
  updateNode,
  toggleShowBody,
  updateNodePath,
  updateNodeSchema,
  setShowBodyVisibility,
} = flowSlice.actions;
export default flowSlice.reducer;
