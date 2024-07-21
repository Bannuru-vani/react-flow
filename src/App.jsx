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
import TableView from "./components/TableView";

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
  const [error, setError] = useState("");

  const addBlock = useStore((state) => state.addBlock);
  const fetchBlocks = useStore((state) => state.fetchBlocks);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleAddBlock = () => {
    if (name.trim() === "") {
      setError("Name is required");
      return;
    }
    addBlock(name, properties);
    setName("");
    setProperties([]);
    handleClose();
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePropertiesChange = (event) => {
    let value = event.target.value;
    setProperties(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <ReactFlowProvider>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ boxShadow: "none" }}>
          <Toolbar>
            <Box py={1} px={5}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Test
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={2}>
            <Stack alignItems="center" justifyContent="center" ml={2}>
              <ModalView handleClickOpen={handleClickOpen} />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8} md={10} height="80vh" mb={2}>
            <Box p={3} height="100%">
              <Flow />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TableView />
          </Grid>
        </Grid>

        <Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Form</DialogTitle>
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
                <InputLabel id="demo-multiple-name-label">
                  Properties
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
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
            </DialogContent>
            <Divider />
            <DialogActions sx={{ my: 2, mx: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAddBlock} variant="contained">
                CREATE
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ReactFlowProvider>
  );
}
