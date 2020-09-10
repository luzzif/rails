import styled from "styled-components";
import { Box } from "reflexbox";

export const TransactionsContainer = styled(Box)`
    background: ${(props) => props.theme.foreground};
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    height: 100%;
    overflow-y: hidden;
`;
