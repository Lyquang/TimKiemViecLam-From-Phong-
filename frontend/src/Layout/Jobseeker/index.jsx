import React from "react";
import { Outlet } from "react-router-dom";
const Jobseeker = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Outlet/>
        </div>
    )
}
export default Jobseeker;