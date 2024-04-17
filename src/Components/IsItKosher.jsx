import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/system';
import "./AnswerStyle.scss";

const IsItKosher = ({ answer }) => {
  const kosherProducts = answer?.isItKosher?.products?.data || [];
  const [expandedItems, setExpandedItems] = useState(
    Array(kosherProducts.length).fill(false)
  );

  const handleChange = (index) => {
    const newExpandedItems = [...expandedItems];
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  return (
    <Paper className='isItKosher-wrapper' elevation={3}>
      {kosherProducts.length > 0 ? (
        <>
          <Typography sx={{pb:2}}>
            Below is the list of products I have found. Please note that kosher certification may vary, so it's advisable to check specific product packaging for the most accurate and up-to-date information.
          </Typography>
          {kosherProducts.map((product, index) => (
            <Accordion
              key={product.id}
              expanded={expandedItems[index]}
              onChange={() => handleChange(index)}
            >
              <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
                <Box>
                  <Typography className="kosher-heading">{product.brand}</Typography>
                  <Typography className='kosher-product-name'>
                    <strong>{product.name}</strong>
                  </Typography>
                  <Typography className="kosher-heading">{product.source.name}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="kosher-text">
                  <strong>Brand:</strong> {product.brand}<br />
                  <strong>Condition Type:</strong> {product.condition_Type}<br />
                  <strong>Symbol:</strong> {product.symbol}<br />
                  <strong>Category:</strong> {product.category}<br />
                  <strong>Additional Info:</strong>{' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: product.notes.replace(/<br\s*[/]?>/gi, '<br/>'),
                    }}
                  />
                  <br />
                  <strong>Is Gluten-Free:</strong> {product.isGlutenFree ? 'True' : 'False'}<br />
                  <strong>Is Kosher:</strong> {product.isKosher ? 'True' : 'False'}<br />
                  <strong>Is Kosher for Passover:</strong> {product.isKosherPassover ? 'True' : 'False'}<br />
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      ) : (
        <Typography variant="body1">
          No kosher products found. Please check back later or try a different search.
        </Typography>
      )}
    </Paper>
  );
};

export default IsItKosher;
