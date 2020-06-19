import React from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import {
    faArrowUp,
    faPlus,
    faList,
    faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { ActionButton } from "../../../components/action-button";
import { FormattedMessage } from "react-intl";

export const ButtonsStrip = ({ onSend, onDeposit, onWithdrawal, onAssets }) => (
    <Flex width="100%">
        <Box
            width={1 / 3}
            display="flex"
            justifyContent="center"
            minWidth="auto"
        >
            <ActionButton
                faIcon={faArrowUp}
                title={<FormattedMessage id="dashboard.send" />}
                size={[52, 56, 60]}
                faIconSize={24}
                onClick={onSend}
            />
        </Box>
        <Box
            width={1 / 3}
            display="flex"
            justifyContent="center"
            minWidth="auto"
        >
            <ActionButton
                faIcon={faPlus}
                title={<FormattedMessage id="dashboard.deposit" />}
                size={[52, 56, 60]}
                faIconSize={24}
            />
        </Box>
        <Box
            width={1 / 3}
            display="flex"
            justifyContent="center"
            minWidth="auto"
        >
            <ActionButton
                faIcon={faMinus}
                title={<FormattedMessage id="dashboard.withdraw" />}
                size={[52, 56, 60]}
                faIconSize={24}
            />
        </Box>
        <Box
            width={1 / 3}
            display="flex"
            justifyContent="center"
            minWidth="auto"
        >
            <ActionButton
                faIcon={faList}
                title={<FormattedMessage id="dashboard.change.asset" />}
                size={[52, 56, 60]}
                faIconSize={24}
                onClick={onAssets}
            />
        </Box>
    </Flex>
);

ButtonsStrip.propTypes = {
    onSend: PropTypes.func.isRequired,
    onDeposit: PropTypes.func.isRequired,
    onWithdrawal: PropTypes.func.isRequired,
    onAssets: PropTypes.func.isRequired,
};
