import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext"
import { useContext } from "react";

export const PrivateRoute = () => {
    const [state] = useContext(UserContext)
    
    if (state.user.role === "user") {
        return <Outlet />
    }
    return <Navigate to="/" />
}
