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

export const ButtonsStrip = ({
    asset,
    onSend,
    onDeposit,
    onWithdraw,
    onAssets,
}) => (
    <Flex width="100%" justifyContent="space-around">
        {!asset.balance.isZero() && (
            <Box>
                <ActionButton
                    faIcon={faArrowUp}
                    title={<FormattedMessage id="dashboard.send" />}
                    size={[52, 56, 60]}
                    faIconSize={24}
                    onClick={onSend}
                />
            </Box>
        )}
        <Box>
            <ActionButton
                faIcon={faPlus}
                title={<FormattedMessage id="dashboard.deposit" />}
                size={[52, 56, 60]}
                faIconSize={24}
                onClick={onDeposit}
            />
        </Box>
        {!asset.balance.isZero() && (
            <Box>
                <ActionButton
                    faIcon={faMinus}
                    title={<FormattedMessage id="dashboard.withdraw" />}
                    size={[52, 56, 60]}
                    faIconSize={24}
                    onClick={onWithdraw}
                />
            </Box>
        )}
        <Box>
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
    onWithdraw: PropTypes.func.isRequired,
    onAssets: PropTypes.func.isRequired,
};
