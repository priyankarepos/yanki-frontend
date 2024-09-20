import React from "react";
import {
    Typography,
    Button,
    Tooltip,
    Box,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import {
    initialQuestions1,
    initialQuestions2,
    initialQuestions3,
    initialQuestions4,
} from "../../Utils/promptData/promptData";
import "./NewHomePageStyle.scss";
import {
    classNames,
} from "../../Utils/stringConstant/stringConstant";
import { responsiveHomeSlider } from "../../Utils/functions/uiFunctions";
import { useTranslation } from "react-i18next";
import { sourceSelectionStrings } from "../../Utils/stringConstant/stringConstant";
import YankiLogo from "../../Assets/images/yanki-logo2.png"

const getTranslationKey = (arrayName, index) => `${arrayName}.${index}`;

export const NewHomePageSlider = ({ activeTab, t, handleQuestionClick }) => {
    return (
        <div>
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
                {initialQuestions1.map((question, index) => (
                    <div key={question.id} className={sourceSelectionStrings.carouselItem}>
                        <Button
                            className={`${sourceSelectionStrings.yaSliderBtn} ${activeTab === 0
                                ? sourceSelectionStrings.yaSearchDarkTheme
                                : sourceSelectionStrings.yaSearchLightTheme
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions1.${index}`
                                )
                            }
                        >
                            <Tooltip
                                title={<span>{t(`initialQuestions1.${index}`)}</span>}
                            >
                                <span>{t(`initialQuestions1.${index}`)}</span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
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
                {initialQuestions2.map((question, index) => (
                    <div key={question.id} className={sourceSelectionStrings.carouselItem}>
                        <Button
                            className={`${sourceSelectionStrings.yaSliderBtn} ${activeTab === 0
                                ? sourceSelectionStrings.yaSearchDarkTheme
                                : sourceSelectionStrings.yaSearchLightTheme
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions2.${index}`
                                )
                            }
                        >
                            <Tooltip
                                title={<span>{t(`initialQuestions2.${index}`)}</span>}
                            >
                                <span>{t(`initialQuestions2.${index}`)}</span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
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
                {initialQuestions3.map((question, index) => (
                    <div key={question.id} className={sourceSelectionStrings.carouselItem}>
                        <Button
                            className={`${sourceSelectionStrings.yaSliderBtn} ${activeTab === 0
                                ? sourceSelectionStrings.yaSearchDarkTheme
                                : sourceSelectionStrings.yaSearchLightTheme
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions3.${index}`
                                )
                            }
                        >
                            <Tooltip
                                title={<span>{t(`initialQuestions3.${index}`)}</span>}
                            >
                                <span>{t(`initialQuestions3.${index}`)}</span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
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
                {initialQuestions4.map((question, index) => (
                    <div key={question.id} className={sourceSelectionStrings.carouselItem}>
                        <Button
                            className={`${sourceSelectionStrings.yaSliderBtn} ${activeTab === 0
                                ? sourceSelectionStrings.yaSearchDarkTheme
                                : sourceSelectionStrings.yaSearchLightTheme
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions4.${index}`
                                )
                            }
                        >
                            <Tooltip
                                title={<span>{t(`initialQuestions4.${index}`)}</span>}
                            >
                                <span>{t(`initialQuestions4.${index}`)}</span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export const NewHomePageMuiMobile = ({ activeTab, t, handleQuestionClick }) => {
    const allQuestions = [
        {
            questions: initialQuestions1,
            name: classNames.languageInitialQuestions1,
        },
        {
            questions: initialQuestions2,
            name: classNames.languageInitialQuestions2,
        },
        {
            questions: initialQuestions3,
            name: classNames.languageInitialQuestions3,
        },
        {
            questions: initialQuestions4,
            name: classNames.languageInitialQuestions4,
        },
    ];

    return (
        <div className={sourceSelectionStrings.homeTableScroll}>
            {allQuestions.map((group, groupIndex) => (
                <Typography className={sourceSelectionStrings.yaMobilePrompt} key={groupIndex}>
                    {group.questions.map((question, index) => (
                        <span
                            key={question.id}
                            onClick={() =>
                                handleQuestionClick(
                                    getTranslationKey(group.name, index)
                                )
                            }
                            className={`${sourceSelectionStrings.yaHomeTableBtn} ${activeTab === 0
                                ? sourceSelectionStrings.yaSearchDarkTheme
                                : sourceSelectionStrings.yaSearchLightTheme
                                }`}
                        >
                            <Tooltip
                                title={
                                    <span>
                                        {t(getTranslationKey(group.name, index), {
                                            defaultValue: question.text,
                                        })}
                                    </span>
                                }
                            >
                                {t(getTranslationKey(group.name, index), {
                                    defaultValue: question.text,
                                })}
                            </Tooltip>
                        </span>
                    ))}
                </Typography>
            ))}
        </div>
    );
};

export const HomeMainDescription = ({ activeTab }) => {
    const { t } = useTranslation();

    return (
        <Box className={`${sourceSelectionStrings.yaMainTextBbox} ${sourceSelectionStrings.homeMinusMargin}`}>
            {activeTab === 0 && <img
                src={YankiLogo}
                width={sourceSelectionStrings.yankiLogoWidth}
                height={sourceSelectionStrings.myZamninLogoWidth}
                alt={sourceSelectionStrings.logo}
            />}
            <Typography className={`${activeTab === 1 && classNames.enterpriseLightColor} ${sourceSelectionStrings.yaMainTextHeading}`}
            >
                {t('homeMainCenterText')}
            </Typography>
        </Box>
    );
};
