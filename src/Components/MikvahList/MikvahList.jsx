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
    Grid,
} from "@mui/material";
import {
    LocationCity,
    Home,
    Public,
    MyLocation,
    Business,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "../../Pages/NewHomePageMui/NewHomePageStyle.scss";
import "./MikvahAnswer.scss";

const MikvahAnswer = () => {
    const result = [
        {
            "id": "206",
            "name": "Mikvah Of Washington Heights",
            "shul": "K'HAL ADATH JESHURUN",
            "type": "Bor Min HaTzad - Side by Side - Bor Geshomim on the side of the immersion pool",
            "address": "4351 Broadway",
            "city": "New York",
            "state": "NY",
            "country": "United States",
            "latitude": "40.8531837463379",
            "longitude": "-73.9342346191406"
        },
        {
            "id": "766",
            "name": "Fort Lee Mikvah",
            "shul": "BEIT YOSEF CONGREGATION/YOUNG ISRAEL OF FORT LEE",
            "type": "Bor Min HaTzad - Side by Side - Bor Geshomim on the side of the immersion pool",
            "address": "313 Tom Hunter Road",
            "city": "Fort Lee",
            "state": "NJ",
            "country": "United States",
            "latitude": "40.848991394043",
            "longitude": "-73.9751434326172"
        },
        {
            "id": "207",
            "name": "Jacques And Hanna Schwalbe Mikvah",
            "shul": "CHABAD OF THE UPPER EAST SIDE",
            "type": "Built Both Ways: Bor Geshomim below immersion pool and Bor Geshomim on the side of the immersion pool",
            "address": "419 East 77th Street",
            "city": "New York",
            "state": "NY",
            "country": "United States",
            "latitude": "40.770877",
            "longitude": "-73.9527782"
        }
    ];

    const Row = ({ row }) => {
        const [open, setOpen] = useState(false);

        return (
            <>
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
                            <span>{row.name}</span>
                        </Tooltip>
                    </TableCell>
                    <TableCell>
                        <Tooltip title={row.address}>
                            <div className="govaden-answer-tooltip">
                                {row.address}
                            </div>
                        </Tooltip>
                    </TableCell>
                    <TableCell>5 km</TableCell>
                </TableRow>
                <TableRow sx={{ "& > *": { borderBottom: "1px solid #3f7baf" } }}>
                    <TableCell className='govaden-answer-prayer-table' colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }} className="mikvah-detail-box">
                                <Typography variant="h6" gutterBottom component="div" sx={{ pb: 2 }}>
                                    Detail Data
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box className="mikvah-detail-info">
                                            <Typography className="mikvah-detail-info-logo">
                                                <Business />
                                            </Typography>
                                            <Box className="mikvah-detail-info-content">
                                                <Typography>
                                                    <strong>Shul:</strong>
                                                </Typography>
                                                <Typography>
                                                    {row.shul}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box className="mikvah-detail-info">
                                            <Typography className="mikvah-detail-info-logo">
                                                <Home />
                                            </Typography>
                                            <Box className="mikvah-detail-info-content">
                                                <Typography>
                                                    <strong>Type:</strong>
                                                </Typography>
                                                <Typography>
                                                    {row.type}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box className="mikvah-detail-info">
                                            <Typography className="mikvah-detail-info-logo">
                                                <LocationCity />
                                            </Typography>
                                            <Box className="mikvah-detail-info-content">
                                                <Typography>
                                                    <strong>City:</strong>
                                                </Typography>
                                                <Typography>
                                                    {row.city}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box className="mikvah-detail-info">
                                            <Typography className="mikvah-detail-info-logo">
                                                <MyLocation />
                                            </Typography>
                                            <Box className="mikvah-detail-info-content">
                                                <Typography>
                                                    <strong>State:</strong>
                                                </Typography>
                                                <Typography>
                                                    {row.state}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box className="mikvah-detail-info">
                                            <Typography className="mikvah-detail-info-logo">
                                                <Public />
                                            </Typography>
                                            <Box className="mikvah-detail-info-content">
                                                <Typography>
                                                    <strong>Country:</strong>
                                                </Typography>
                                                <Typography>
                                                    {row.country}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    {/* <Grid item xs={6}>
                                        <Typography>
                                            <LocationOn sx={{ marginRight: 1 }} />
                                            <strong>Latitude:</strong> {row.latitude}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            <Map sx={{ marginRight: 1 }} />
                                            <strong>Longitude:</strong> {row.longitude}
                                        </Typography>
                                    </Grid> */}
                                </Grid>
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
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow sx={{ "& > *": { borderBottom: "1px solid #3f7baf" } }}>
                            <TableCell />
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Distance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default MikvahAnswer;
