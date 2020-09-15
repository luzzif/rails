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

const BUTTON_SIZE = [40, 52, 56];
const ICON_SIZE = 20;

export const ButtonsStrip = ({
    asset,
    onSend,
    onDeposit,
    onWithdraw,
    onAssets,
}) => (
    <Flex width="100%" justifyContent="space-around">
        <Box>
            <ActionButton
                faIcon={faArrowUp}
                title={<FormattedMessage id="dashboard.send" />}
                size={BUTTON_SIZE}
                faIconSize={ICON_SIZE}
                disabled={asset.balance.isZero()}
                onClick={onSend}
            />
        </Box>
        <Box>
            <ActionButton
                faIcon={faPlus}
                title={<FormattedMessage id="dashboard.deposit" />}
                size={BUTTON_SIZE}
                faIconSize={ICON_SIZE}
                onClick={onDeposit}
            />
        </Box>
        <Box>
            <ActionButton
                faIcon={faMinus}
                title={<FormattedMessage id="dashboard.withdraw" />}
                size={BUTTON_SIZE}
                faIconSize={ICON_SIZE}
                disabled={asset.balance.isZero()}
                onClick={onWithdraw}
            />
        </Box>
        <Box>
            <ActionButton
                faIcon={faList}
                title={<FormattedMessage id="dashboard.change.asset" />}
                size={BUTTON_SIZE}
                faIconSize={ICON_SIZE}
                onClick={onAssets}
            />
        </Box>
    </Flex>
);

ButtonsStrip.propTypes = {
    onSend: PropTypes.func.isRequired,
    onDeposit: PropTypes.func.isRequired,
    onWithdraw: PropTypes.func.isRequired,
    onAssets: PropTypes.func.isRequired,
};
