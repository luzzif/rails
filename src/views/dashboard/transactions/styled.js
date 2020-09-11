import styled from "styled-components";
import { Flex } from "reflexbox";

export const RootFlex = styled(Flex)`
    transition: background 0.3s ease;
    background: ${(props) => props.theme.foreground};
`;

export const ListFlex = styled(Flex)`
    position: relative;
    min-height: 340px;
    height: 340px;
    overflow-y: auto;
`;
