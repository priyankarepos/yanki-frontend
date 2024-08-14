import { Box, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';

const HatzalahDisclaimer = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Typography component="div" className="hatzalah-disclaimer" >
          {t('hatzalahDisclaimer1')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer2')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer3')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer4')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer5')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer6')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer7')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer8')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer9')}
        </Typography>

        <Typography component="div" className="hatzalah-disclaimer">
          {t('hatzalahDisclaimer10')}
        </Typography>
      </Box>
    </>
  );
};

export default HatzalahDisclaimer;
