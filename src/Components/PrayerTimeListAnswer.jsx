import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { zmanName } from "./Helpers/Helper";

const PrayerTimeListAnswer = ({ answer }) => {
  const allList = Object.entries(answer.response);
  let list;

  if (!allList[11][1]) {
    list = allList.filter(([zman, time]) => {
      return zman !== "CandleLighting";
    });
  } else {
    list = allList;
  }

  list = allList.filter(([zman, time]) => {
    return zmanName[zman] && time;
  });

  return (
    <>
      <Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="div" className="text-center">
            City: {list[0][1]} & Date: {list[1][1].slice(0, 10)}
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ width: "100%", maxWidth: "600px", mt: 2, mx: "auto" }}
          >
            <Table sx={{ width: "100%" }}>
              <TableBody>
                {list.slice(1).map(([zman, time], index) => (
                  <TableRow key={index} sx={{ "td, th": { border: 0 } }}>
                    <TableCell>{zmanName[zman]}</TableCell>
                    <TableCell>{String(time).slice(11, -3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default PrayerTimeListAnswer;
