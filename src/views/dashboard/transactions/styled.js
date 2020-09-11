import styled from "styled-components";
import { Flex } from "reflexbox";

export const RootFlex = styled(Flex)`
    transition: background 0.3s ease;
    background: ${(props) => props.theme.foreground};
`;

export const ListFlex = styled(Flex)`
    position: relative;
    min-height: 300px;
    height: 300px;
    overflow-y: auto;
`;
