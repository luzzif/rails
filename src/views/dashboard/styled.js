import styled from "styled-components";
import { Box } from "reflexbox";

export const TransactionsContainer = styled(Box)`
    background: ${(props) => props.theme.foreground};
    border-radius: 24px;
    overflow-y: hidden;
`;
