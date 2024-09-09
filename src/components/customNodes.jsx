import { Stack } from "@mui/material";
import React from "react";
// import { Handle, Position } from "reactflow";

const EllipseNode = ({ data }) => {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      style={{
        borderRadius: "50%",
        width: 100,
        height: 60,
        backgroundColor: data.color || "#ddd",
        color: "white",
      }}
    >
      {/* <Handle type="target" position={Position.Top} /> */}

      <div>{data.label}</div>
      {/* <Handle type="source" position={Position.Bottom} /> */}
    </Stack>
  );
};

const RectangleNode = ({ data }) => {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      style={{ width: 100, height: 60, backgroundColor: data.color || "#ddd" }}
    >
      {/* <Handle type="target" position={Position.Top} /> */}

      <div>{data.label}</div>
      {/* <Handle type="source" position={Position.Bottom} /> */}
    </Stack>
  );
};

const TriangleNode = ({ data }) => {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      style={{
        position: "relative",
        width: 0,
        height: 0,
        borderLeft: "50px solid transparent",
        borderRight: "50px solid transparent",
        borderBottom: `100px solid ${data.color || "#ddd"}`,
      }}
    >
      {/* <Handle type="target" position={Position.Top} /> */}

      <div
        style={{
          position: "absolute",
          top: "50px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {data.label}
      </div>
      {/* <Handle type="source" position={Position.Bottom} /> */}
    </Stack>
  );
};

export { EllipseNode, RectangleNode, TriangleNode };
