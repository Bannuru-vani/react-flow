import { Add } from "@mui/icons-material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Chip, IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import * as React from "react";
import useStore from "../zustand/store";

const CircuitPanel = ({ handleClickOpen }) => {
  const circuits = useStore((state) => state.circuits);
  const currentCircuitId = useStore((state) => state.currentCircuitId);
  const removeBlock = useStore((state) => state.removeBlock);

  const circuit = circuits.find((c) => c.id === currentCircuitId);
  const blocks = circuit ? circuit.blocks : [];
  const handleDelete = (id) => {
    removeBlock(id);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", height: "100vh", p: 2 }}>
      <Typography variant="h6" textAlign="center">
        Nodes
      </Typography>
      <List>
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <ListItem
              disablePadding
              key={block.id}
              sx={{
                position: "relative",
                mb: 1,
                "&:hover .delete-button": { display: "block" },
              }}
            >
              <Chip
                label={block.name}
                variant="outlined"
                style={{
                  boxShadow: "0px 1px 8px -3px #00bcd4",
                }}
                onDelete={() => {}}
                deleteIcon={<RemoveCircleIcon />}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" textAlign="center">
            No blocks available
          </Typography>
        )}
      </List>
      <IconButton
        aria-label="delete"
        color="primary"
        size="small"
        sx={{ border: "1px solid", width: "28px", height: "28px" }}
        onClick={handleClickOpen}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default CircuitPanel;
