import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import useStore from "../zustand/store";

import { debounce } from "lodash";

const getNodePosition = (index, existingPositions) => {
  const defaultPosition = { x: (index + 1) * 100, y: (index + 1) * 100 };
  return existingPositions[index] || defaultPosition;
};

export default function Flow() {
  const blocks = useStore((state) => state.blocks);
  const updateNodePositions = useStore((state) => state.updateNodePositions);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodePositions = useRef({});

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const newBlocks = blocks.map((block, index) => {
      const position =
        block.position || getNodePosition(index, nodePositions.current);
      const newNode = {
        id: `node-${index + 1}`,
        position,
        data: { label: block.name },
      };
      return newNode;
    });
    setNodes(newBlocks);
  }, [blocks]);

  useEffect(() => {
    nodes.forEach((node, index) => {
      nodePositions.current[index] = node.position;
    });
  }, [nodes]);

  const debouncedUpdateNodePositions = useCallback(
    debounce((nodes) => {
      updateNodePositions(nodes);
    }, 300),
    []
  );

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const updatedNodes = changes.reduce((acc, change) => {
        if (change.type === "position") {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            acc.push({ ...node, position: change.position });
          }
        }
        return acc;
      }, []);

      if (updatedNodes.length > 0) {
        const updatedPositions = updatedNodes.reduce((acc, node) => {
          acc[node.id] = node.position;
          return acc;
        }, {});

        nodePositions.current = {
          ...nodePositions.current,
          ...updatedPositions,
        };
        console.log(updatedNodes, nodes);
        debouncedUpdateNodePositions(updatedNodes);
      }
    },
    [nodes, onNodesChange, updateNodePositions]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
}
