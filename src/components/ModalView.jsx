import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import * as React from "react";
import useStore from "../zustand/store";

const ModalView = ({ handleClickOpen }) => {
  const blocks = useStore((state) => state.blocks);
  const removeBlock = useStore((state) => state.removeBlock);

  const handleDelete = (id) => {
    removeBlock(id);
  };

  return (
    <Box
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      pt={5}
    >
      <Typography variant="h6" textAlign="center">
        Model View
      </Typography>
      <List>
        {blocks.map((block) => (
          <ListItem
            disablePadding
            key={block.id}
            sx={{
              position: "relative",
              "&:hover .delete-button": { display: "block" },
            }}
          >
            <ListItemText primary={block.name} sx={{ textAlign: "center" }} />

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
              onClick={() => handleDelete(block.id)}
            >
              <DeleteIcon
                sx={{ fontSize: "18px", transform: "translate(-25%, -50%)" }}
              />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Stack alignItems="center">
        <Button variant="outlined" onClick={handleClickOpen}>
          create component
        </Button>
      </Stack>
    </Box>
  );
};

export default ModalView;
