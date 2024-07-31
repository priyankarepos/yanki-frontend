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
import { useTranslation } from "react-i18next";

const IsItKosher = ({ answer }) => {
  const { t } = useTranslation();
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
        <div>
          <Typography sx={{pb:2}}>
            {t('productsFound')}
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
                  <strong>{t('brand')}</strong> {product.brand}<br />
                  <strong>{t('conditionType')}</strong> {product.condition_Type}<br />
                  <strong>{t('symbol')}</strong> {product.symbol}<br />
                  <strong>{t('category')}</strong> {product.category}<br />
                  <strong>{t('additionalInfo')}</strong>{' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: product.notes.replace(/<br\s*[/]?>/gi, '<br/>'),
                    }}
                  />
                  <br />
                  <strong>{t('isGlutenFree')}</strong> {product.isGlutenFree ? 'True' : 'False'}<br />
                  <strong>{t('isKosher')}</strong> {product.isKosher ? 'True' : 'False'}<br />
                  <strong>{t('isKosherForPassover')}</strong> {product.isKosherPassover ? 'True' : 'False'}<br />
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ) : (
        <Typography variant="body1">
          {t('noKosherProductsFound')}
        </Typography>
      )}
    </Paper>
  );
};

export default IsItKosher;
