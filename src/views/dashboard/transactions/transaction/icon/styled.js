import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Container = styled.div`
    border-radius: 50%;
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${(props) => props.color};
`;

export const Icon = styled(FontAwesomeIcon)`
    font-size: 20px;
    color: #fff;
`;
