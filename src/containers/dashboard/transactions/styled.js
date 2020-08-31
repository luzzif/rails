import styled, { css } from "styled-components";
import { Box, Flex } from "reflexbox";
import InfiniteScroll from "react-infinite-scroller";

export const RootFlex = styled(Flex)`
    transition: background 0.3s ease;
    background: ${(props) => props.theme.foreground};
`;

export const OverlayBox = styled(Box)`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 1;
    transition: opacity 0.3s ease;
    transform: translateY(0);
    ${(props) =>
        !props.open &&
        css`
            opacity: 0;
            transition: transform 0.3s ease 0.3s, opacity 0.3s ease;
            transform: translateY(-10000px);
        `}
`;

export const ListFlex = styled(Flex)`
    position: relative;
    overflow-y: auto;
`;

export const StyledInfiniteScroll = styled(InfiniteScroll)`
    width: 100%;
`;
