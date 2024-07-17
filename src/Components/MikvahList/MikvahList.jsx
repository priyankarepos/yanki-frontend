import React, { useState, useEffect } from "react";
import axios from "axios";
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
    Grid,
    Snackbar,
} from "@mui/material";
import {
    Home,
    Business,
    Phone,
    Language,
    Schedule,
} from '@mui/icons-material';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "../../Pages/NewHomePageMui/NewHomePageStyle.scss";
import "./MikvahAnswer.scss";
import { apiUrls, messages } from "../../Utils/stringConstant/stringConstant";

const MikvahAnswer = ({ answer }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const Row = ({ row }) => {
        const [open, setOpen] = useState(false);
        const [mikvahDetails, setMikvahDetails] = useState(null);

        useEffect(() => {
            if (open) {
                axios.get(`${apiUrls.mikvahDetails}`, { params: { mikvahId: row.id } })
                    .then(response => {
                        setMikvahDetails(response.data);
                    })
                    .catch(error => {
                        setSnackbarMessage(messages.mikvahDetailsError, error);
                        setSnackbarOpen(true);
                    });
            }
        }, [open, row.id]);

        return (
            <>
                <TableRow
                    onClick={() => setOpen(!open)}
                    sx={{cursor:messages.cursorPointer}}
                >
                    <TableCell>
                        <p>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</p>
                    </TableCell>
                    <TableCell>
                        <Tooltip title={row.name}>
                            <span>{row.name ? row.name : messages.notAvailable}</span>
                        </Tooltip>
                    </TableCell>
                    <TableCell>
                        <Tooltip title={row.address.trim() || messages.notAvailable}>
                            <div className={messages.govadenAnswerTooltip}>
                                {row.address.trim() ? row.address : messages.notAvailable}
                            </div>
                        </Tooltip>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ py: 0 }} colSpan={6}>
                        <Collapse in={open} unmountOnExit>
                            <Box sx={{ margin: 1 }} className={messages.mikvahDetailBox}>
                                {mikvahDetails ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Home />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Address:</strong>
                                                    </Typography>
                                                    <Typography>
                                                        {mikvahDetails.result.address.trim() ? mikvahDetails.result.address : messages.notAvailable}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Phone />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Phone:</strong>
                                                    </Typography>
                                                    {mikvahDetails.result.phone1.trim() ? <><Typography>{mikvahDetails.result.phone1}</Typography>
                                                        <Typography>{mikvahDetails.result.phone2}</Typography></> : <Typography>NA</Typography>}
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Home />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Contact:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.contact ? mikvahDetails.result.contact : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Business />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Shul:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.shul.trim() ? mikvahDetails.result.shul : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PanToolAltIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Type:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.type.trim() ? mikvahDetails.result.type : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Language />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Website:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.website.trim() ? mikvahDetails.result.website : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Schedule />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Schedule:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.schedule.trim() ? mikvahDetails.result.schedule : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Typography>Loading...</Typography>
                                )}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label={messages.collapsibleTable}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {answer?.mikvahSearchResponse?.result && answer?.mikvahSearchResponse?.result.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    );
};

export default MikvahAnswer;
