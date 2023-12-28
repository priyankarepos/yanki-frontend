import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const IsItKosher = () => {
    const dummyApiResponse = {
        "products": {
            "data": [
                {
                    "id": 2880262,
                    "name": "Nabisco, OREO Summer Treats Club Pack - OREO DS + OREO CHURRO",
                    "brand": "Mondelez Global LLC",
                    "condition_type": "Dairy",
                    "symbol": "OU-D",
                    "category": "Cookies, Crackers, Biscuits & Wafers",
                },
                {
                    "id": 66778,
                    "name": "Nabisco, OREO Summer Treats Club Pack - OREO DS + OREO CHURRO",
                    "brand": "Mondelez Global LLC",
                    "condition_type": "Dairy",
                    "symbol": "OU-D",
                    "category": "Cookies, Crackers, Biscuits & Wafers",
                },
                // Add more dummy data
            ],
            "total": 495
        }
    };

    const [expandedItems, setExpandedItems] = useState([]);

    const handleChange = (index) => {
        const newExpandedItems = [...expandedItems];
        newExpandedItems[index] = !newExpandedItems[index];
        setExpandedItems(newExpandedItems);
    };

    return (
        <Paper elevation={3} style={{ backgroundColor: "#0e3557", padding: "10px" }}>
            {dummyApiResponse.products.data.map((product, index) => (
                <Accordion
                    key={product.id}
                    expanded={expandedItems[index]}
                    onChange={() => handleChange(index)}
                >
                    <AccordionSummary
                        expandIcon={expandedItems[index] ? <ExpandLess /> : <ExpandMore />}
                        IconButtonProps={{ edge: 'start' }}
                    >
                        <Typography><strong>{product.name}</strong></Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography>
                            <strong>Brand:</strong> {product.brand}<br />
                            <strong>Condition Type:</strong> {product.condition_type}<br />
                            <strong>Symbol:</strong> {product.symbol}<br />
                            <strong>Category:</strong> {product.category}<br />
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Paper>
    );
};

export default IsItKosher;
