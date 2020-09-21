import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { formatBigNumber } from "../../utils/conversion";

const NegativeText = styled.span`
    color: ${(props) => props.theme.error};
`;

const PositiveText = styled.span`
    color: ${(props) => props.theme.success};
`;

export const OperationFee = ({ amount, tokenSymbol, variant }) => {
    return amount && amount.isZero() ? (
        <PositiveText>
            <FormattedMessage id={`operation.fee.free.${variant}`} />
        </PositiveText>
    ) : (
        <NegativeText>
            <FormattedMessage
                id={`operation.fee.cost.${variant}`}
                values={{ amount: formatBigNumber(amount, 4), tokenSymbol }}
            />
        </NegativeText>
    );
};

OperationFee.propTypes = {
    amount: PropTypes.object.isRequired,
    tokenSymbol: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(["deposit", "withdrawal", "transfer"]).isRequired,
};
