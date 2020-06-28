import styled from "styled-components";

export const Root = styled.div`
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: background 0.3s ease, color 0.3s ease;
    height: 100%;
    width: 100%;
`;
