import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, ListItemText, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import "./SourceSelectionMenu.scss"
import { sourceSelectionOptions } from '../../Utils/promptData/promptData';
import { sourceSelectionStrings } from '../../Utils/stringConstant/stringConstant';

const SourceSelectionMenu = ({ anchorEl, open, handleClose, selectedOption, setSelectedOption, resetPage }) => {
    const MAX_VISIBLE_OPTIONS = 5;
    const [visibleOptions, setVisibleOptions] = useState(MAX_VISIBLE_OPTIONS);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        setVisibleOptions(MAX_VISIBLE_OPTIONS);
        setShowMore(false);
        localStorage.setItem(sourceSelectionStrings.localStorageKey, selectedOption);
        setSelectedOption(selectedOption);
    }, []);

    useEffect(() => {
        localStorage.setItem(sourceSelectionStrings.localStorageKey, selectedOption);
    }, [selectedOption]);

    const handleSelectOption = (option) => {
        if (option === selectedOption) {
            return;
        }
        localStorage.setItem(sourceSelectionStrings.localStorageKey, option);
        setSelectedOption(option);
        resetPage(false, false);
        handleClose();
    };

    const handleShowMore = () => {
        setShowMore(true);
        setVisibleOptions(sourceSelectionOptions.length);
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
            slotProps={{
                paper: {
                    style: {
                        maxHeight: showMore ? 300 : 48 * MAX_VISIBLE_OPTIONS,
                        overflowY: sourceSelectionStrings.auto,
                    }
                }
            }}
        >
            {sourceSelectionOptions.slice(0, visibleOptions).map((option) => (
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
            {!showMore && sourceSelectionOptions.length > MAX_VISIBLE_OPTIONS && (
                <MenuItem onClick={handleShowMore} className={sourceSelectionStrings.menuItemClass}>
                    <Button className={sourceSelectionStrings.menuItemButton} variant={sourceSelectionStrings.text}>Show more</Button>
                </MenuItem>
            )}
        </Menu>
    );
};

export default SourceSelectionMenu;