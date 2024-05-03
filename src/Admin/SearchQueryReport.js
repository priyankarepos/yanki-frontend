import React from "react";
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
} from "@mui/material";

const SearchQueryReport = ({ queryAnswer }) => {
  return (
    <div>
      {queryAnswer && (
        <div>
          {queryAnswer == null ? (
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="body1">
                  Please select a date range to view search queries.
                </Typography>
              </Grid>
            </Grid>
          ) : queryAnswer && queryAnswer.data && queryAnswer.data.length > 0 ? (
            <TableContainer sx={{ my: 2 }} component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sl No</TableCell>
                    <TableCell>Query</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queryAnswer.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        <Tooltip title={item.query} arrow>
                          <div className="search-query-cell">{item.query}</div>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>{queryAnswer}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchQueryReport;
