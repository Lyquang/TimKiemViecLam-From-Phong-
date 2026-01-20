import React from "react";
import { useLocation } from "react-router-dom";

const ImgHome = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="img-container w-[90%] m-auto">
      <img
        src={path === "/" ? "/image-home.png" : "/image-other.png"}
        alt="Background"
        className={`img-home ${path === "/" ? "home-img" : "other-img"}`}
      />
    </div>
  );
};

export default ImgHome;
