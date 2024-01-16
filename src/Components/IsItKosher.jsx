import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import "./AnswerStyle.scss";
import { Box } from '@mui/system';

const IsItKosher = ({ answer }) => {
  const kosherProducts = answer?.isItKosher?.products?.data || [];

  const [expandedItems, setExpandedItems] = useState(Array(kosherProducts.length).fill(false));

  const handleChange = (index) => {
    const newExpandedItems = [...expandedItems];
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  return (
    <Paper elevation={3} style={{ backgroundColor: "#0e3557", padding: "10px" }}>
      {kosherProducts.map((product, index) => (
        <Accordion
          key={product.id /* Assuming "id" is a unique identifier for each product */}
          expanded={expandedItems[index]}
          onChange={() => handleChange(index)}
        >
          <AccordionSummary
            expandIcon={expandedItems[index] ? <ExpandLess /> : <ExpandMore />}
            IconButtonProps={{ edge: 'start' }}
          >
            <Box>
              <Typography className="kosher-heading">{product.brand}</Typography>
              <Typography><strong>{product.name}</strong></Typography>
              <Typography className="kosher-heading">{product.source.name}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography className="kosher-text">
              <strong>Brand:</strong> {product.brand}<br />
              <strong>Condition Type:</strong> {product.condition_Type}<br />
              <strong>Symbol:</strong> {product.symbol}<br />
              <strong>Category:</strong> {product.category}<br />
              {/* <strong>Is Gluten-Free:</strong> {product.isGlutenFree ? <CheckCircle /> : <Cancel />}<br />
              <strong>Is Halal:</strong> {product.isHalal ? <CheckCircle /> : <Cancel />}<br />
              <strong>Is Hipster:</strong> {product.isHipster ? <CheckCircle /> : <Cancel />}<br />
              <strong>Is Kosher:</strong> {product.isKosher ? <CheckCircle /> : <Cancel />}<br />
              <strong>Is Kosher for Passover:</strong> {product.isKosherPassover ? <CheckCircle /> : <Cancel />}<br /> */}
              <strong>Is Gluten-Free:</strong> {product.isGlutenFree ? 'True' : 'False'}<br />
              <strong>Is Halal:</strong> {product.isHalal ? 'True' : 'False'}<br />
              <strong>Is Hipster:</strong> {product.isHipster ? 'True' : 'False'}<br />
              <strong>Is Kosher:</strong> {product.isKosher ? 'True' : 'False'}<br />
              <strong>Is Kosher for Passover:</strong> {product.isKosherPassover ? 'True' : 'False'}<br />
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default IsItKosher;
