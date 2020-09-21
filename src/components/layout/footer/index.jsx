import React from "react";
import { FlexContainer, VersionBox } from "./styled";
import { FormattedMessage } from "react-intl";
import { version } from "../../../../package.json";

export const Footer = () => (
    <FlexContainer
        px="20px"
        py="8px"
        alignItems="center"
        justifyContent="center"
        width="100vw"
    >
        <VersionBox>
            <FormattedMessage id="footer.version" values={{ version }} />
        </VersionBox>
    </FlexContainer>
);
