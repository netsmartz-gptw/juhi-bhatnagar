import React, { Component } from "react";
import {useLocation, Route, Navigate} from 'react-router-dom'
// import { AuthGuard } from "../services/session/auth.guard";

const SecureRouter = ({ component: Component, ...rest }) => {
    const location = useLocation();
    // const useSecureRoutes(routes, locationArg)
    return (
        <Route {...rest}>
            {/* {AuthGuard.isAuthenticated === true ? */}
                <Component />
                {/* : */}
                <Navigate to={{ pathname: "/login", state: { from: location } }} />
            {/* } */}
            {console.log(rest)}
        </Route>
    )
}

export default SecureRouter;