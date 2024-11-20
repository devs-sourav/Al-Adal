import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import {
  CiCircleQuestion,
  CiMobile3,
  CiFacebook,
  CiInstagram,
  CiYoutube,
} from "react-icons/ci";
import { HiOutlineMapPin } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { FaMapLocation } from "react-icons/fa6";
import { socialList } from "../../constants";

const UpperHeader = () => {
  return (
    <header className="border-b px-14 font-inter border-b-border  py-2.5 text-gray-200 hidden lg:block">
      {/* bg-brand */}
      <div className="  mx-auto text-texthead flex justify-between items-center ">
        <div className="flex gap-x-8 items-center">
          <Link
            to="/contact"
            className="flex items-center gap-x-2 text-texthead transition-all ease-linear duration-200 hover:text-danger"
          >
            <span className="text-lg">
              <CiCircleQuestion />
            </span>
            <span className="text-para">Can we help you?</span>
          </Link>
          <Link
            to={"tel:01829169610"}
            className="flex items-center gap-x-2 text-texthead transition-all ease-linear duration-200 hover:text-danger"
          >
            <span className="text-lg">
              <CiMobile3 />
            </span>
            <span className="text-para">01712-653211</span>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-x-5 ">
            {socialList.map((item, index) => {
              const Icon = item?.logo
              return (
                <Link key={index} target="_blanck" to={item?.link}>
                  <span className="text-lg hover:text-danger text-gray-700 transition-all ease-linear duration-200">
                    <Icon />
                  </span>
                </Link>
              );
            })}
            <Link target="_blanck" to={"https://maps.app.goo.gl/dT6YP2jBQf3fAwjW8"}>
              <span className="text-lg hover:text-danger text-gray-700 transition-all ease-linear duration-200">
                <FaMapLocation />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UpperHeader;
