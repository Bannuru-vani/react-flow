import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useDnD } from "../ccontext/DnDContext";
import useStore from "../zustand/store";

const ModalView = ({ handleClickOpen, selectedCircuit }) => {
  const circuits = useStore((state) => state.circuits);
  const removeBlock = useStore((state) => state.removeBlock);

  const handleDelete = (blockId) => {
    removeBlock(selectedCircuit, blockId);
  };

  const [_, setCircuitId] = useDnD();

  const onDragStart = (event, cid) => {
    setCircuitId(cid);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      pt={5}
    >
      <Typography variant="h6" textAlign="center">
        Libraries
      </Typography>

      <List>
        {circuits.length === 0 ? (
          <Typography variant="body2" textAlign="center" mt={2}>
            No circuits available.
          </Typography>
        ) : (
          circuits.map((circuit) => (
            <ListItem
              disablePadding
              key={circuit.id}
              sx={{
                position: "relative",
                padding: "8px",
                "&:hover .delete-button": { display: "block" },
              }}
              onDragStart={(event) => onDragStart(event, circuit.id)}
              draggable
            >
              <ListItemText
                primary={circuit.name}
                sx={{ textAlign: "center" }}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                className="delete-button"
                sx={{
                  display: "none",
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  width: "25px",
                  height: "25px",
                }}
                onClick={() => handleDelete(circuit.id)}
              >
                <DeleteIcon
                  sx={{ fontSize: "18px", transform: "translate(-25%, -50%)" }}
                />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>

      <Stack alignItems="center" mt={3}>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          disabled={!selectedCircuit}
        >
          Create Component
        </Button>
      </Stack>
    </Box>
  );
};

export default ModalView;
