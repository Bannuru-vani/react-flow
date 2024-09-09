import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import useStore from "../zustand/store";

import { debounce } from "lodash";
import { useDnD } from "../ccontext/DnDContext";
import { EllipseNode, RectangleNode, TriangleNode } from "./customNodes";

const nodeTypes = {
  ellipse: EllipseNode,
  rectangle: RectangleNode,
  triangle: TriangleNode,
};

const getNodePosition = (index, existingPositions) => {
  const defaultPosition = { x: (index + 1) * 100, y: (index + 1) * 100 };
  return existingPositions[index] || defaultPosition;
};

export default function Flow({ setSelectedCircuit, selectedCircuit }) {
  const blocks = useStore((state) => state.blocks);
  const circuits = useStore((state) => state.circuits);
  const storeEdges = useStore((state) => state.edges);
  const fetchBlocks = useStore((state) => state.fetchBlocks);
  const fetchEdges = useStore((state) => state.fetchEdges);
  const selectCircuit = useStore((state) => state.selectCircuit);

  const updateNodePositions = useStore((state) => state.updateNodePositions);
  const updateCircuitPosition = useStore(
    (state) => state.updateCircuitPosition
  );
  const saveEdges = useStore((state) => state.saveEdges);
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [circuitId] = useDnD();
  const nodePositions = useRef({});

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();

      if (!circuitId) {
        return;
      }

      const newPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      await updateCircuitPosition(circuitId, newPosition);
      selectCircuit(circuitId);
    },
    [screenToFlowPosition, circuitId]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updatedEdges = addEdge(params, eds);
        saveEdges(updatedEdges);
        return updatedEdges;
      });
    },
    [setEdges, saveEdges]
  );

  useEffect(() => {
    if (selectedCircuit) {
      fetchBlocks(selectedCircuit);
      fetchEdges(selectedCircuit);
    }
  }, [selectedCircuit, fetchBlocks, fetchEdges]);

  useEffect(() => {
    let selectedCircuit = circuits.find((c) => c.id === circuitId);
    let circuitPosition = selectedCircuit?.position;
    if (!circuitPosition) return;

    const newBlocks = blocks.map((block, index) => {
      const blockPosition =
        block.position || getNodePosition(index, nodePositions.current);

      const position = {
        x: blockPosition.x + circuitPosition.x,
        y: blockPosition.y + circuitPosition.y,
      };

      return {
        id: block.id,
        position,
        data: { label: block.name, ...block.data },
        type: block.type,
        sourcePosition: "right",
      };
    });

    setNodes(newBlocks);
  }, [blocks, selectedCircuit, setNodes]);

  useEffect(() => {
    nodes.forEach((node, index) => {
      nodePositions.current[node.id] = node.position;
    });
  }, [nodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  const debouncedUpdateNodePositions = useCallback(
    debounce((nodes) => {
      updateNodePositions(nodes);
    }, 300),
    [updateNodePositions]
  );

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const updatedNodes = changes.reduce((acc, change) => {
        if (change.type === "position") {
          debugger;
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

        debouncedUpdateNodePositions(updatedNodes);
      }
    },
    [nodes, onNodesChange, debouncedUpdateNodePositions]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      saveEdges(edges);
    },
    [edges, onEdgesChange, saveEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      ref={reactFlowWrapper}
      nodeTypes={nodeTypes}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
}
