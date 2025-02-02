import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Navlog from "../Images/nav.png";
import Dash_icon from "../Images/dashboard_icon.png";
import Dep_icon from "../Images/departments.png";
import Req_icon from "../Images/requests.png";
import Log from "../Images/Logout.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [selected, setSelected] = useState("Dashboard");
  const [tubePosition, setTubePosition] = useState(0);

  // Synchronize the selected menu with the current URL path
  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setSelected("Dashboard");
        setTubePosition(0);
        break;
      case "/departments":
        setSelected("Departments");
        setTubePosition(76);
        break;
      case "/requests":
        setSelected("Requests");
        setTubePosition(152);
        break;
      case "/reports":
        setSelected("Reports");
        setTubePosition(228);
        break;
      default:
        setSelected("Dashboard");
        setTubePosition(0);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center w-56 h-screen bg-[#2D6B5C] text-white pt-4 pr-4 relative">
      <img src={Navlog} alt="logo" />
      <div className="grid grid-cols-1 gap-8 mt-16 mr-8 relative">
        {/* Grey Tube */}
        <div
          className="absolute left-[-20px] h-12 w-2 bg-gray-300 rounded-full transition-all duration-300"
          style={{ top: `${tubePosition}px` }}
        ></div>

        {/* Menu Items */}
        <div>
          <button
            className="flex items-center"
            onClick={() => {
              if (selected !== "Dashboard") {
                setSelected("Dashboard");
                navigate("/dashboard");
              }
            }}
          >
            <img className="w-10 mb-2" src={Dash_icon} alt="Dashboard Icon" />
            <h1 className="text-sm font-normal">Dashboard</h1>
          </button>
        </div>
        <div>
          <button
            className="flex items-center"
            onClick={() => {
              if (selected !== "Departments") {
                setSelected("Departments");
                navigate("/departments");
              }
            }}
          >
            <img className="w-10 mb-2" src={Dep_icon} alt="Departments Icon" />
            <h1 className="text-sm font-normal">Departments</h1>
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 w-full px-4">
        <button onClick={() => navigate("/")} className="flex items-center">
          <img className="w-10 mr-2" src={Log} alt="Logout Icon" />
          <h1 className="text-sm font-normal">Log out</h1>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
