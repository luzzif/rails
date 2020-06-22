import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../../components/button";

// FIXME: still to be tested
export const Confirmation = ({ onClose }) => (
    <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        pb={4}
        pt={1}
        px={[3, 4]}
    >
        <Box fontSize="5em" color="#00e676" mb={2}>
            <FontAwesomeIcon icon={faCheckCircle} />
        </Box>
        <Box
            width={["80%", "70%", "60%", "50%", "40%"]}
            mb={4}
            textAlign="center"
            color="#00e676"
        >
            <FormattedMessage id="send.form.confirmation.ok" />
        </Box>
        <Box>
            <Button onClick={onClose}>
                <FormattedMessage id="send.form.confirmation.button.close" />
            </Button>
        </Box>
    </Flex>
);

Confirmation.propTypes = {
    onClose: PropTypes.func.isRequired,
};
