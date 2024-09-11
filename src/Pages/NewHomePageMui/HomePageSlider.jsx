import React from "react";
import {
    Typography,
    Button,
    Tooltip,
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

const getTranslationKey = (arrayName, index) => `${arrayName}.${index}`;
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

export const NewHomePageSlider = ({ activeTab, t, handleQuestionClick, }) => {
    return (
        <div>
            <Carousel
                responsive={responsiveHomeSlider}
                itemClass="carousel-item"
                swipeable={true}
                draggable={false}
                showDots={false}
                arrows={false}
                autoPlay={true}
                autoPlaySpeed={2000}
                infinite={true}
                className="new-home-initial-questions"
                customTransition="transform 500ms ease 0s"
            >
                {initialQuestions1.map((question, index) => (
                    <div key={question.id} className="carousel-item">
                        <Button
                            className={`ya-slider-btn ${activeTab === 0
                                ? "ya-search-dark-theme"
                                : "ya-search-light-theme"
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions1.${question.id - 1}`
                                )
                            }
                        >
                            <Tooltip
                                title={
                                    <span>
                                        {t(`initialQuestions1.${question.id - 1}`)}
                                    </span>
                                }
                            >
                                <span>
                                    {t(`initialQuestions1.${question.id - 1}`)}
                                </span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
            <Carousel
                responsive={responsiveHomeSlider}
                itemClass="carousel-item"
                swipeable={true}
                draggable={false}
                showDots={false}
                arrows={false}
                autoPlay={true}
                autoPlaySpeed={2000}
                infinite={true}
                customTransition="transform 500ms ease 0s"
                className="new-home-initial-questions"
            >
                {initialQuestions2.map((question, index) => (
                    <div key={question.id} className="carousel-item">
                        <Button
                            className={`ya-slider-btn ${activeTab === 0
                                ? "ya-search-dark-theme"
                                : "ya-search-light-theme"
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions2.${question.id - 11}`
                                )
                            }
                        >
                            <Tooltip
                                title={
                                    <span>
                                        {t(`initialQuestions2.${question.id - 11}`)}
                                    </span>
                                }
                            >
                                <span>
                                    {t(`initialQuestions2.${question.id - 11}`)}
                                </span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
            <Carousel
                responsive={responsiveHomeSlider}
                itemClass="carousel-item"
                swipeable={true}
                draggable={false}
                showDots={false}
                arrows={false}
                autoPlay={true}
                autoPlaySpeed={2000}
                infinite={true}
                customTransition="transform 500ms ease 0s"
                className="new-home-initial-questions"
            >
                {initialQuestions3.map((question, index) => (
                    <div key={question.id} className="carousel-item">
                        <Button
                            className={`ya-slider-btn ${activeTab === 0
                                ? "ya-search-dark-theme"
                                : "ya-search-light-theme"
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions3.${question.id - 21}`
                                )
                            }
                        >
                            <Tooltip
                                title={
                                    <span>
                                        {t(`initialQuestions3.${question.id - 21}`)}
                                    </span>
                                }
                            >
                                <span>
                                    {t(`initialQuestions3.${question.id - 21}`)}
                                </span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
            <Carousel
                responsive={responsiveHomeSlider}
                itemClass="carousel-item"
                swipeable={true}
                draggable={false}
                showDots={false}
                arrows={false}
                autoPlay={true}
                autoPlaySpeed={2000}
                infinite={true}
                customTransition="transform 500ms ease 0s"
                className="new-home-initial-questions"
            >
                {initialQuestions4.map((question, index) => (
                    <div key={question.id} className="carousel-item">
                        <Button
                            className={`ya-slider-btn ${activeTab === 0
                                ? "ya-search-dark-theme"
                                : "ya-search-light-theme"
                                }`}
                            onClick={() =>
                                handleQuestionClick(
                                    `initialQuestions4.${question.id - 31}`
                                )
                            }
                        >
                            <Tooltip
                                title={
                                    <span>
                                        {t(`initialQuestions4.${question.id - 31}`)}
                                    </span>
                                }
                            >
                                <span>
                                    {t(`initialQuestions4.${question.id - 31}`)}
                                </span>
                            </Tooltip>
                        </Button>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export const NewHomePageMuiMobile = ({ activeTab, t, handleQuestionClick, }) => {

    return (
        <div className="home-table-scroll">
            {allQuestions.map((group, groupIndex) => (
                <Typography
                    className="ya-mobile-prompt"
                    key={groupIndex}
                >
                    {group.questions.map((question, index) => (
                        <span
                            key={question.id}
                            onClick={() =>
                                handleQuestionClick(
                                    getTranslationKey(group.name, index)
                                )
                            }
                            className={`ya-home-table-btn ${activeTab === 0
                                ? "ya-search-dark-theme"
                                : "ya-search-light-theme"
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