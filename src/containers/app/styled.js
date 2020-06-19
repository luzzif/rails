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

    .toast-root {
        width: auto;
    }

    @media (max-width: 600px) {
        .toast-root {
            width: 100vw;
        }
    }

    .toast-container {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
        border-radius: 16px;
    }

    .toast-body {
        font-size: 16px;
        font-family: "Montserrat";
        padding: 0px 16px;
    }
`;
