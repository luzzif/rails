import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({
    component: Component,
    condition,
    redirectTo,
    ...rest
}) => (
    <Route
        {...rest}
        render={props =>
            condition ? <Component {...props} /> : <Redirect to={redirectTo} />
        }
    />
);

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    condition: PropTypes.bool.isRequired,
    redirectTo: PropTypes.string.isRequired
};
