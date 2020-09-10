import styled from "styled-components";
import { Flex } from "reflexbox";
import InfiniteScroll from "react-infinite-scroller";

export const RootFlex = styled(Flex)`
    transition: background 0.3s ease;
    background: ${(props) => props.theme.foreground};
`;

export const ListFlex = styled(Flex)`
    position: relative;
    overflow-y: auto;
`;

export const StyledInfiniteScroll = styled(InfiniteScroll)`
    width: 100%;
`;
