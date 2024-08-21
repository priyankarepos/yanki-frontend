import React, { useState } from 'react';
import { questions } from '../../Utils/promptData/InterectiveQuestions';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import "./InteractiveQuestionnaire.scss";
import { useTranslation } from 'react-i18next';

const InteractiveQuestionnaire = ({clickableOff}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(Array(questions.length).fill(""));
    const [showThankYou, setShowThankYou] = useState(false);
    const { t } = useTranslation();
    const questionAKey = `question${currentQuestionIndex + 1}_A`;
    const questionBKey = `question${currentQuestionIndex + 1}_B`;

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowThankYou(true);
        }
    };

    const handleResponseChange = (e) => {
        const updatedResponses = [...responses];
        updatedResponses[currentQuestionIndex] = e.target.value;
        setResponses(updatedResponses);
    };

    return (
        <Paper sx={{ p: 2 }} className='Interactive-Questionnaire-Wrapper'>
            <Typography variant='h6' sx={{ pb: 2 }}>{t('lashonHaraQuestionnaire')}</Typography>
            {currentQuestionIndex === 0 && (
                <Typography sx={{ pb: 2 }} className='Interactive-Questionnaire-Msg'>
                    {t('questionnaireDescription')}
                </Typography>
            )}
            {!showThankYou && <Box className='Interactive-Questionnaire-Content'>
                <Box className='Interactive-Questionnaire'>
                    <Typography className='Interactive-Questionnaire-A'>{currentQuestionIndex + 1}. {t(questionAKey)}</Typography>
                    <Typography className='Interactive-Questionnaire-B'>{t(questionBKey)}</Typography>
                    <TextField
                        type="text"
                        value={responses[currentQuestionIndex]}
                        onChange={handleResponseChange}
                        multiline
                        minRows={1} 
                        maxRows={Infinity} 
                        disabled={clickableOff}
                    />
                </Box>
                {!showThankYou && (
                    <Box className="Interactive-Questionnaire-Btns">
                        <Button
                            variant='outlined'
                            onClick={handleNext}
                            disabled={!responses[currentQuestionIndex]}
                        >
                            {t('nextButton')}
                        </Button>
                    </Box>
                )}
            </Box>}
            {showThankYou && (
                <Typography className="Interactive-Questionnaire-margin">
                    {t('completionMessage')}
                </Typography>
            )}
        </Paper>
    );
};

export default InteractiveQuestionnaire;
