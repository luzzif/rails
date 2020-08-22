import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
        font-family: "Montserrat", sans-serif;
    }

    body {
        margin: 0;
        height: 100%;
    }

    #root {
        height: 100%;
    }

    .custom-toast-root {
        width: auto !important;
    }

    @media (max-width: 600px) {
        .custom-toast-root {
            left: 16px !important;
            right: 16px !important;
        }
    }

    .custom-toast-container {
        margin-top: 16px !important;
        box-shadow: 0px 30px 62px 0px ${(props) =>
            props.theme.shadow} !important;
        border-radius: 16px !important;
    }

    .custom-toast-body {
        font-family: "Montserrat";
        padding: 4px 8px;
    }

    .Toastify__toast {
        min-height: auto !important;
    }

    .Toastify__toast-body {
        margin: 0 !important;
    }

    .Toastify__toast--warning {
        background: ${(props) => props.theme.warning} !important;
    }
    
    .Toastify__toast--error {
        background: ${(props) => props.theme.error} !important;
    }
`;
