import React, { useEffect } from 'react';
import { Menu, MenuItem, ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import "./SourceSelectionMenu.scss"
import { sourceSelectionOptions } from '../../Utils/promptData/promptData';
import { sourceSelectionStrings } from '../../Utils/stringConstant/stringConstant';

const SourceSelectionMenu = ({ anchorEl, open, handleClose,selectedOption, setSelectedOption }) => {

    useEffect(() => {
        setSelectedOption(sourceSelectionStrings.defaultOption);
    }, []);

    useEffect(() => {
        sessionStorage.setItem(sourceSelectionStrings.localStorageKey, selectedOption);
    }, [selectedOption]);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        handleClose();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            className={sourceSelectionStrings.menuClassName}
            anchorOrigin={{ horizontal: sourceSelectionStrings.anchorOriginHorizontal, vertical: sourceSelectionStrings.anchorOriginVertical }}
            transformOrigin={{ horizontal: sourceSelectionStrings.transformOriginHorizontal, vertical: sourceSelectionStrings.transformOriginVertical }}
            disableAutoFocusItem={true}
        >
            {sourceSelectionOptions.map((option) => (
                <MenuItem
                    key={option.value}
                    onClick={option.clickable ? () => handleSelectOption(option.value) : null}
                    className={`${sourceSelectionStrings.menuItemClass} ${selectedOption === option.value ? sourceSelectionStrings.selectedClass : ''} ${!option.clickable ? sourceSelectionStrings.disabledClass : ''}`}
                    disabled={!option.clickable}
                >
                    <ListItemText primary={option.label} />
                    {selectedOption === option.value && option.clickable && (
                        <CheckIcon fontSize={sourceSelectionStrings.small} />
                    )}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default SourceSelectionMenu;