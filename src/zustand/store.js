import { create } from "zustand";
import axios from "axios";

const apiUrlCircuits = "http://localhost:3000/circuits";

const useStore = create((set, get) => ({
  circuits: [],
  currentCircuitId: null,
  blocks: [],
  edges: [],

  fetchCircuits: async () => {
    try {
      const response = await axios.get(apiUrlCircuits);
      set({ circuits: response.data });
    } catch (error) {
      console.error("Error fetching circuits:", error);
    }
  },

  addCircuit: async (name, position = { x: 0, y: 0 }) => {
    try {
      const newCircuit = { name, position, blocks: [], edges: [] };
      const response = await axios.post(apiUrlCircuits, newCircuit);
      set((state) => ({
        circuits: [...state.circuits, response.data],
      }));
    } catch (error) {
      console.error("Error adding circuit:", error);
    }
  },

  removeCircuit: async (id) => {
    try {
      await axios.delete(`${apiUrlCircuits}/${id}`);
      set((state) => ({
        circuits: state.circuits.filter((circuit) => circuit.id !== id),

        ...(state.currentCircuitId === id
          ? { blocks: [], edges: [], currentCircuitId: null }
          : {}),
      }));
    } catch (error) {
      console.error("Error deleting circuit:", error);
    }
  },

  selectCircuit: async (id) => {
    set({ currentCircuitId: id });
    await get().fetchBlocks();
    await get().fetchEdges();
  },

  fetchBlocks: async () => {
    const circuitId = get().currentCircuitId;
    if (!circuitId) {
      console.error("No circuit selected");
      return;
    }
    try {
      const response = await axios.get(`${apiUrlCircuits}/${circuitId}`);
      set({ blocks: response?.data?.blocks });
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  },

  addBlock: async (
    name,
    properties,
    position = { x: 0, y: 0 },
    type,
    data,
    style
  ) => {
    const circuitId = get().currentCircuitId;
    if (!circuitId) {
      console.error("No circuit selected");
      return;
    }

    try {
      const response = await axios.get(`${apiUrlCircuits}/${circuitId}`);
      const circuit = response.data;

      if (!circuit) {
        console.error("Circuit not found");
        return;
      }

      const newBlock = {
        id: Date.now().toString(36),
        name,
        properties,
        position,
        type,
        data,
        style,
      };

      const updatedBlocks = [...circuit.blocks, newBlock];

      const updatedCircuit = { ...circuit, blocks: updatedBlocks };

      await axios.put(`${apiUrlCircuits}/${circuitId}`, updatedCircuit);
      get().fetchCircuits();

      set((state) => ({
        blocks: [...state.blocks, newBlock],
      }));
    } catch (error) {
      console.error("Error adding block:", error);
    }
  },

  removeBlock: async (id) => {
    const circuitId = get().currentCircuitId;
    if (!circuitId) {
      console.error("No circuit selected");
      return;
    }
    try {
      await axios.delete(`${apiUrlCircuits}/${circuitId}/blocks/${id}`);
      set((state) => ({
        blocks: state.blocks.filter((block) => block.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  },

  updateNodePositions: async (nodes) => {
    const circuitId = get().currentCircuitId;
    if (!circuitId) {
      console.error("No circuit selected");
      return;
    }

    try {
      const circuitResponse = await axios.get(`${apiUrlCircuits}/${circuitId}`);
      const circuit = circuitResponse.data;

      if (!circuit || !circuit.blocks) {
        console.error("Circuit or blocks not found");
        return;
      }

      const updatedBlocks = circuit.blocks.map((block) => {
        const updatedNode = nodes.find((node) => node.id === block.id);
        if (updatedNode) {
          const updatedPosition = {
            x: updatedNode.position.x - circuit.position.x,
            y: updatedNode.position.y - circuit.position.y,
          };
          return {
            ...block,
            position: updatedPosition,
          };
        }
        return block;
      });

      const updatedCircuit = { ...circuit, blocks: updatedBlocks };

      await axios.put(`${apiUrlCircuits}/${circuitId}`, updatedCircuit);

      set({ blocks: updatedBlocks });
    } catch (error) {
      console.error("Error updating node positions:", error);
    }
  },

  updateCircuitPosition: async (circuitId, newPosition) => {
    const state = get();
    const circuit = state.circuits.find((c) => c.id === circuitId);

    if (!circuit) {
      console.error("Circuit not found");
      return;
    }

    const updatedCircuit = {
      ...circuit,
      position: newPosition, // Update circuit's position only
    };

    try {
      await axios.put(`${apiUrlCircuits}/${circuitId}`, updatedCircuit);

      set((state) => ({
        circuits: state.circuits.map((c) =>
          c.id === circuitId ? updatedCircuit : c
        ),
      }));
    } catch (error) {
      console.error("Error updating circuit position:", error);
    }
  },
  updateBlockPosition: async (circuitId, blockId, newBlockPosition) => {
    const state = get();
    const circuit = state.circuits.find((c) => c.id === circuitId);

    if (!circuit) {
      console.error("Circuit not found");
      return;
    }

    const updatedBlocks = circuit.blocks.map((block) =>
      block.id === blockId
        ? { ...block, position: newBlockPosition } // Update only the moved block's position
        : block
    );

    const updatedCircuit = {
      ...circuit,
      blocks: updatedBlocks,
    };

    try {
      await axios.put(`${apiUrlCircuits}/${circuitId}`, updatedCircuit);

      set((state) => ({
        circuits: state.circuits.map((c) =>
          c.id === circuitId ? updatedCircuit : c
        ),
      }));
    } catch (error) {
      console.error("Error updating block position:", error);
    }
  },

  fetchEdges: async () => {
    const circuitId = get().currentCircuitId;
    if (!circuitId) {
      console.error("No circuit selected");
      return;
    }
    try {
      const response = await axios.get(`${apiUrlCircuits}/${circuitId}`);
      set({ edges: response?.data?.edges });
    } catch (error) {
      console.error("Error fetching edges:", error);
    }
  },

  saveEdges: async (newEdges) => {
    const circuitId = get().currentCircuitId;
    if (!circuitId) {
      console.error("No circuit selected");
      return;
    }

    try {
      const circuitResponse = await axios.get(`${apiUrlCircuits}/${circuitId}`);
      const circuit = circuitResponse.data;

      if (!circuit || !circuit.edges) {
        console.error("Circuit or edges not found");
        return;
      }

      const updatedEdges = newEdges.map((newEdge) => {
        const existingEdge = circuit.edges.find(
          (edge) => edge.id === newEdge.id
        );
        if (existingEdge) {
          return { ...existingEdge, ...newEdge };
        }

        return newEdge;
      });

      const updatedCircuit = { ...circuit, edges: updatedEdges };

      await axios.put(`${apiUrlCircuits}/${circuitId}`, updatedCircuit);

      set({ edges: newEdges });
    } catch (error) {
      console.error("Error saving edges:", error);
    }
  },
}));

export default useStore;
