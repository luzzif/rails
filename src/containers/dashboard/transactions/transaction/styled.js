import styled from "styled-components";
import { Box, Flex } from "reflexbox";

export const HoverableContainer = styled(Flex)`
    border-radius: 24px;
    transition: background 0.3s ease;
    cursor: pointer;
    :hover {
        background: ${(props) => props.theme.background};
    }
`;

export const AmountText = styled.div`
    color: ${(props) => props.color};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const OneLineText = styled(Box)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
