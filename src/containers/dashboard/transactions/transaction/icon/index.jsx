import React from "react";
import PropTypes from "prop-types";
import { Container, Icon } from "./styled";
import {
    faPlus,
    faMinus,
    faArrowUp,
    faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

export const TransactionIcon = ({ deposit, withdraw, sent, color }) => {
    const getIcon = () => {
        let icon = null;
        if (deposit) {
            icon = faPlus;
        } else if (withdraw) {
            icon = faMinus;
        } else if (sent) {
            icon = faArrowUp;
        } else {
            icon = faArrowDown;
        }
        return <Icon icon={icon} />;
    };

    return <Container color={color}>{getIcon()}</Container>;
};

TransactionIcon.propTypes = {
    deposit: PropTypes.bool,
    withdraw: PropTypes.bool,
    sent: PropTypes.bool,
    color: PropTypes.string,
};
