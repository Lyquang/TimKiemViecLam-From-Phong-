import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/userContext";

const ProtectedRoute = (props) => {
    //const { token } = useContext(UserContext);
    const token = localStorage.getItem("TOKEN");

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('USER'))
        if (!token || !user.role.includes(props.name)) {
            console.log("fall");
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    return props.children;
};

export default ProtectedRoute;