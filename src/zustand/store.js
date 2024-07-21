import { create } from "zustand";
import axios from "axios";

const apiUrl = "http://localhost:3000/blocks";

const useStore = create((set, get) => ({
  blocks: [],

  fetchBlocks: async () => {
    try {
      const response = await axios.get(apiUrl);
      set({ blocks: response.data });
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  },

  addBlock: async (name, properties) => {
    try {
      const newBlock = { name, properties };
      const response = await axios.post(apiUrl, newBlock);
      set((state) => ({
        blocks: [...state.blocks, response.data],
      }));
    } catch (error) {
      console.error("Error adding block:", error);
    }
  },

  removeBlock: async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      set((state) => ({
        blocks: state.blocks.filter((block) => block.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  },
  updateNodePositions: async (nodes) => {
    try {
      const state = get();
      const updatedBlocks = [];
      for (const node of nodes) {
        console.log(nodes);
        const index = parseInt(node.id.split("-")[1], 10) - 1;
        const block = state.blocks[index];
        if (block) {
          block.position = node.position;
          const response = await axios.put(`${apiUrl}/${block.id}`, block);
          updatedBlocks.push(response.data);
        }
      }
    } catch (error) {
      console.error("Error updating node positions:", error);
    }
  },
}));

export default useStore;
