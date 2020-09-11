import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { Text } from "./styled";
import { ActionButton } from "../action-button";

export const Pagination = ({ page, itemsPerPage, size, onPageChange }) => {
    const [pagesAmount, setPagesAmount] = useState([]);

    useEffect(() => {
        if (itemsPerPage) {
            if (size <= itemsPerPage) {
                setPagesAmount(1);
                return;
            }
            setPagesAmount(Math.ceil(size / itemsPerPage));
        }
    }, [itemsPerPage, size]);

    const handlePreviousPage = useCallback(() => {
        onPageChange(page - 1);
    }, [onPageChange, page]);

    const handleNextPage = useCallback(() => {
        onPageChange(page + 1);
    }, [onPageChange, page]);

    return (
        <Flex height="32px" alignItems="center">
            <Box mr="8px">
                <ActionButton
                    dark
                    size={32}
                    faIconSize={20}
                    disabled={page === 0}
                    onClick={handlePreviousPage}
                    faIcon={faCaretLeft}
                />
            </Box>
            <Box mr="8px">
                <Text highlighted>
                    {page * itemsPerPage + 1}-
                    {page * itemsPerPage + itemsPerPage > size
                        ? size
                        : page * itemsPerPage + itemsPerPage}
                </Text>
            </Box>
            <Box mr="8px">
                <Text>/</Text>
            </Box>
            <Box mr="8px">
                <Text>{size}</Text>
            </Box>
            <Box>
                <ActionButton
                    dark
                    size={32}
                    faIconSize={20}
                    disabled={page + 1 === pagesAmount}
                    onClick={handleNextPage}
                    faIcon={faCaretRight}
                />
            </Box>
        </Flex>
    );
};

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};
