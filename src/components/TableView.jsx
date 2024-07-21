import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import useStore from "../zustand/store";

const TableView = () => {
  const blocks = useStore((state) => state.blocks);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ bgcolor: "black", color: "white" }}>
              Name
            </TableCell>
            <TableCell align="right" sx={{ bgcolor: "black", color: "white" }}>
              Properties
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blocks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Typography variant="body1" color="textSecondary">
                  No Data Available
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            blocks.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <TableCell>
                  <Grid container justifyContent="space-between">
                    <Grid item>{row.name}</Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container justifyContent="space-between">
                    <Grid item style={{ flexGrow: 1 }}></Grid>
                    <Grid item>
                      <Stack flexDirection="row" gap={1}>
                        {row.properties.map((pro) => (
                          <Typography>{pro}</Typography>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
