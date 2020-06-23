import styled from "styled-components";
import { Flex } from "reflexbox";

export const Container = styled(Flex)`
    position: fixed;
    bottom: ${(props) => (props.open ? "0" : "-100%")};
    transition: bottom 0.3s ease, background 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0px 30px 62px 0px ${(props) => props.theme.shadow};
    background: ${(props) => props.theme.background};
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    left: 0;
    right: 0;
    padding-top: 32px;
    max-height: 84vh;
`;

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #000;
    opacity: ${(props) => (props.open ? "0.5" : "0")};
    transform: translateY(${(props) => (props.open ? "0" : "100000px")});
    transition: ${(props) =>
        props.open
            ? "opacity 0.5s ease"
            : "transform 0.5s ease 0.5s, opacity 0.5s ease"};
`;
