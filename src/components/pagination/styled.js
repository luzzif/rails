import styled from "styled-components";

export const Text = styled.span`
    color: ${(props) => props.theme.text};
    transition: color 0.3s ease;
`;
