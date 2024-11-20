import React from "react";
import Containar from "../../../layouts/Containar";
import logo from "../../../assets/logos/al-adal-Logo-05.png";
import { Link } from "react-router-dom";

const BottomFooter = () => {
  return (
    <footer className="font-inter py-5 bg-[#2B3445]">
      <Containar>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            ©2024{" "}
            <span className="text-danger">
              <Link className="font-bold" target="_blanck" to={"mailto:al.adal0021@gmail.com"}>
                Al-Adal
              </Link>
            </span>
            . All rights reserved. Developed by{" "}
            <Link to={"https://www.okobiz.com"} className="text-white font-bold">
              okobiz
            </Link>
          </p>
        </div>
      </Containar>
    </footer>
  );
};

export default BottomFooter;
