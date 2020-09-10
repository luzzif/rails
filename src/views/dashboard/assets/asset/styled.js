import styled from "styled-components";
import { Flex } from "reflexbox";

export const RootContainer = styled(Flex)`
    transition: background 0.3s ease;
    border-radius: 24px;
    cursor: pointer;
    :hover {
        background: ${(props) => props.theme.foreground};
    }
`;
