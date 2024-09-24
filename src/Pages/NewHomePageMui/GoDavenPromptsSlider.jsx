import React from "react";
import { Typography, Button, Tooltip, Box } from "@mui/material";
import Carousel from "react-multi-carousel";
import { responsiveHomeSlider } from "../../Utils/functions/uiFunctions";
import "./NewHomePageStyle.scss";
import {
    goDavenPrompts,
} from "../../Utils/promptData/promptData";
import { useTranslation } from "react-i18next";
import godavenLogo from "../../Assets/images/partnet-logo1.png";
import { sourceSelectionStrings } from "../../Utils/stringConstant/stringConstant";

const getTranslationKey = (index) => `goDavenPrompts.${index}`;

export const GoDavenSlider = ({ activeTab, t, handleQuestionClick }) => {
    return (
        <Carousel
            responsive={responsiveHomeSlider}
            itemClass={sourceSelectionStrings.carouselItem}
            swipeable={true}
            draggable={false}
            showDots={false}
            arrows={false}
            autoPlay={true}
            autoPlaySpeed={2000}
            infinite={true}
            className={sourceSelectionStrings.newHomeInitialQuestions}
            customTransition={sourceSelectionStrings.transformAnimation}
        >
            {goDavenPrompts.map((prompt, index) => (
                <div key={prompt.id} className={sourceSelectionStrings.carouselItem}>
                    <Button
                        className={`${sourceSelectionStrings.yaSliderBtn} ${sourceSelectionStrings.yaSliderBtnSingle} ${activeTab === 0
                            ? sourceSelectionStrings.yaSearchDarkTheme
                            : sourceSelectionStrings.yaSearchLightTheme
                            }`}
                        onClick={() =>
                            handleQuestionClick(getTranslationKey(index))
                        }
                    >
                        <Tooltip
                            title={<span>{t(getTranslationKey(index), { defaultValue: prompt.text })}</span>}
                        >
                            <span>{t(getTranslationKey(index), { defaultValue: prompt.text })}</span>
                        </Tooltip>
                    </Button>
                </div>
            ))}
        </Carousel>
    );
};

export const GoDavenMuiMobile = ({ activeTab, t, handleQuestionClick }) => {
    return (
        <div className={sourceSelectionStrings.homeTableScroll}>
            <Typography className={sourceSelectionStrings.yaMobilePrompt}>
                {goDavenPrompts.map((prompt, index) => (
                    <span
                        key={prompt.id}
                        onClick={() =>
                            handleQuestionClick(getTranslationKey(index))
                        }
                        className={`${sourceSelectionStrings.yaHomeTableBtn} ${sourceSelectionStrings.yaHomeTableBtnSingle} ${activeTab === 0
                            ? sourceSelectionStrings.yaSearchDarkTheme
                            : sourceSelectionStrings.yaSearchLightTheme
                            }`}
                    >
                        <Tooltip
                            title={
                                <span>
                                    {t(getTranslationKey(index), {
                                        defaultValue: prompt.text,
                                    })}
                                </span>
                            }
                        >
                            {t(getTranslationKey(index), {
                                defaultValue: prompt.text,
                            })}
                        </Tooltip>
                    </span>
                ))}
            </Typography>
        </div>
    );
};

export const GoDavenDescription = () => {
    const { t } = useTranslation();

    return (
        <Box className={sourceSelectionStrings.yaMainTextBbox}>
            <img
                src={godavenLogo}
                width={sourceSelectionStrings.logoWidth}
                height={sourceSelectionStrings.godavenLogoHeight}
                alt={sourceSelectionStrings.logo}
                className={sourceSelectionStrings.marginBottom20}
            />
            <Typography className={sourceSelectionStrings.yaMainTextHeading}>
                {t('goDavenDescription')}
            </Typography>
        </Box>
    );
};

