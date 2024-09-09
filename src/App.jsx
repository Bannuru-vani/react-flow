import {
  Divider,
  FormHelperText,
  Grid,
  OutlinedInput,
  Stack,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ReactFlowProvider } from "@xyflow/react";
import * as React from "react";
import Flow from "./components/Flow";
import ModalView from "./components/ModalView";
import { DnDProvider, useDnD } from "./ccontext/DnDContext";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import useStore from "./zustand/store";
import CircuitPanel from "./components/CircuitPanel.jsx";

const propertiesList = [
  "Confidentiality",
  "Integrity",
  "Authenticity",
  "Authorization",
  "Non-repudiation",
  "Availability",
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [properties, setProperties] = useState([]);
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [selectedCircuit, setSelectedCircuit] = useState("");

  const [nodeColor, setNodeColor] = useState("#000000");

  const handleNodeColorChange = (event) => {
    setNodeColor(event.target.value);
  };

  const addBlock = useStore((state) => state.addBlock);
  const fetchCircuits = useStore((state) => state.fetchCircuits);
  const selectCircuit = useStore((state) => state.selectCircuit);

  useEffect(() => {
    fetchCircuits();
  }, [fetchCircuits]);

  useEffect(() => {
    if (selectedCircuit) {
      selectCircuit(selectedCircuit);
    }
  }, [selectedCircuit, selectCircuit]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePropertiesChange = (event) => {
    let value = event.target.value;
    setProperties(typeof value === "string" ? value.split(",") : value);
  };

  const handleCircuitChange = (event) => {
    setSelectedCircuit(event.target.value);
  };

  const handleTypeChange = (event) => {
    let value = event.target.value;
    setType(value);
  };

  const handleAddBlock = () => {
    if (name.trim() === "") {
      setError("Name is required");
      return;
    }

    let position = { x: 100, y: 100 };
    let data = {
      label: name,
      color: nodeColor,
    };
    let style = { backgroundColor: nodeColor };

    addBlock(name, properties, position, type, data, style);
    setName("");
    setProperties([]);
    setNodeColor("#000000");
    handleClose();
  };

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ boxShadow: "none" }}>
            <Toolbar>
              <Box py={1} pr={5}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Circuits
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>

          <Grid container spacing={2}>
            <Grid item sm={2} md={2}>
              <Stack alignItems="center" justifyContent="center" ml={2}>
                <ModalView
                  handleCircuitChange={handleCircuitChange}
                  selectedCircuit={selectedCircuit}
                />
              </Stack>
            </Grid>
            <Grid item sm={8} height="80vh" mb={2}>
              <Box p={3} height="100%">
                <Flow
                  setSelectedCircuit={setSelectedCircuit}
                  selectedCircuit={selectedCircuit}
                />
              </Box>
            </Grid>

            <Grid item sm={2} md={2}>
              <CircuitPanel
                selectedCircuit={selectedCircuit}
                handleClickOpen={handleClickOpen}
              />
            </Grid>
          </Grid>

          <Box>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Add New</DialogTitle>
              <Divider />
              <DialogContent sx={{ width: "360px" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={handleNameChange}
                  error={Boolean(error)}
                />
                {error && <FormHelperText error>{error}</FormHelperText>}

                <FormControl fullWidth margin="dense">
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    value={type}
                    onChange={handleTypeChange}
                    input={<OutlinedInput label="Type" />}
                  >
                    <MenuItem value="ellipse">Ellipse</MenuItem>
                    <MenuItem value="rectangle">Rectangle</MenuItem>
                    <MenuItem value="triangle">Triangle</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="properties-label">Properties</InputLabel>
                  <Select
                    labelId="properties-label"
                    multiple
                    value={properties}
                    onChange={handlePropertiesChange}
                    renderValue={(selected) => selected.join(", ")}
                    input={<OutlinedInput label="Properties" />}
                  >
                    {propertiesList.map((property) => (
                      <MenuItem key={property} value={property}>
                        <Checkbox checked={properties.indexOf(property) > -1} />
                        <ListItemText primary={property} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack
                  style={{ marginTop: 16 }}
                  direction={"row"}
                  alignItems={"center"}
                  gap={"12px"}
                >
                  <InputLabel>Choose Node Color :</InputLabel>
                  <input
                    type="color"
                    value={nodeColor}
                    onChange={handleNodeColorChange}
                    style={{ width: "80px", height: 40, border: "none" }}
                  />
                </Stack>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ my: 2, mx: 2 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddBlock} variant="contained">
                  ADD
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </DnDProvider>
    </ReactFlowProvider>
  );
}
