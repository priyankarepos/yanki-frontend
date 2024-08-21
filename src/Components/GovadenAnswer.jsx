import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Collapse,
  Box,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "../Pages/NewHomePageMui/NewHomePageStyle.scss";
import { useTranslation } from "react-i18next";

const GovadenAnswer = ({ answer }) => {
  const rows = answer.godavenPrayerDetails;
  const { t } = useTranslation();

  // Define a mapping object for day abbreviations to full day names
  const dayNameMapping = {
    sun: t("sun"),
    mon: t("mon"),
    tues: t("tues"),
    wed: t("wed"),
    thurs: t("thurs"),
    fri: t("fri"),
    sat: t("sat"),
  };

  const Row = ({ row }) => {
    const [open, setOpen] = useState(false);

    const filterRegularTimes = (times) => {
      return times.filter((time) => time.special_days_only.length === 0);
    };

    return (
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": { borderBottom: "1px solid #3f7baf", cursor: "pointer" },
          }}
          onClick={() => setOpen(!open)}
          className="godaven-style"
        >
          <TableCell>
            <p>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</p>
          </TableCell>
          <TableCell component="th" scope="row">
            <Tooltip title={row.name}>
              <div className="govaden-answer-tooltip">{row.name}</div>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Tooltip title={row.formatted_address}>
              <div className="govaden-answer-tooltip">
                {row.formatted_address}
              </div>
            </Tooltip>
          </TableCell>
          <TableCell>{row.phone}</TableCell>
        </TableRow>
        <TableRow sx={{ "& > *": { borderBottom: "1px solid #3f7baf" } }}>
          <TableCell className='govaden-answer-prayer-table' colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                {t('prayerTimes')}
                </Typography>
                <Table size="small" aria-label="prayer-times">
                  <TableHead>
                    <TableRow
                      sx={{ "& > *": { borderBottom: "1px solid #3f7baf" } }}
                    >
                      <TableCell>
                        <Typography>{t('day')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{t('shacharis')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{t('mincha')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{t('maariv')}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.groupedByDayMinyanim &&
                      Object.keys(row.groupedByDayMinyanim).map((day) => (
                        <TableRow
                          key={day}
                          sx={{
                            "& > *": { borderBottom: "1px solid #3f7baf" },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {dayNameMapping[day] || day}
                          </TableCell>
                          <TableCell>
                            {row.groupedByDayMinyanim[day]?.shachris
                              ? filterRegularTimes(
                                  row.groupedByDayMinyanim[day].shachris
                                ).map((time, index) => (
                                  <div key={index}>{time.displayTime}</div>
                                ))
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.groupedByDayMinyanim[day]?.mincha
                              ? filterRegularTimes(
                                  row.groupedByDayMinyanim[day].mincha
                                ).map((time, index) => (
                                  <div key={index}>{time.displayTime}</div>
                                ))
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {row.groupedByDayMinyanim[day]?.mariv
                              ? filterRegularTimes(
                                  row.groupedByDayMinyanim[day].mariv
                                ).map((time, index) => (
                                  <div key={index}>{time.displayTime}</div>
                                ))
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ "& > *": { borderBottom: "1px solid #3f7baf" } }}>
              <TableCell />
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('address')}</TableCell>
              <TableCell>{t('phone')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GovadenAnswer;
