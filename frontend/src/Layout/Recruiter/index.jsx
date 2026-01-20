import { Outlet } from "react-router-dom";
import React from "react";
const Recruiter = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Outlet />
        </div>
    )
}
export default Recruiter;