import styled from "styled-components";

export const StyledImage = styled.img`
    border-radius: 50%;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
`;