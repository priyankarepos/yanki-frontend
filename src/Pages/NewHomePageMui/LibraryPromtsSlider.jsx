import React from "react";
import { Typography, Button, Tooltip, Box } from "@mui/material";
import Carousel from "react-multi-carousel";
import { responsiveHomeSlider } from "../../Utils/functions/uiFunctions";
import "./NewHomePageStyle.scss";
import {
    libraryPrompts,
} from "../../Utils/promptData/promptData";
import { useTranslation } from "react-i18next";
import { sourceSelectionStrings } from "../../Utils/stringConstant/stringConstant";
import YankiLogo from "../../Assets/images/yanki-logo2.png"

const getTranslationKey = (index) => `libraryPrompts.${index}`;

export const LibrarySlider = ({ activeTab, t, handleQuestionClick }) => {
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
            {libraryPrompts.map((prompt, index) => (
                <div key={prompt.id} className={sourceSelectionStrings.carouselItem}>
                    <Button
                        className={`${sourceSelectionStrings.yaSliderBtn} ${activeTab === 0
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

export const LibraryMuiMobile = ({ activeTab, t, handleQuestionClick }) => {
    return (
        <div className={sourceSelectionStrings.homeTableScroll}>
            <Typography className={sourceSelectionStrings.yaMobilePrompt}>
                {libraryPrompts.map((prompt, index) => (
                    <span
                        key={prompt.id}
                        onClick={() =>
                            handleQuestionClick(getTranslationKey(index))
                        }
                        className={`${sourceSelectionStrings.yaHomeTableBtn} ${activeTab === 0
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

export const LibraryDescription = () => {
    const { t } = useTranslation();

    return (
        <Box className={sourceSelectionStrings.yaMainTextBbox}>
            <img
                src={YankiLogo}
                width={sourceSelectionStrings.yankiLogoWidth}
                height={sourceSelectionStrings.myZamninLogoWidth}
                alt={sourceSelectionStrings.logo}
            />
            <Typography className={sourceSelectionStrings.yaMainTextHeading}>
                {t('libraryDescription')}
            </Typography>
        </Box>
    );
};
