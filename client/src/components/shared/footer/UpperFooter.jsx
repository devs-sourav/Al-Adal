import React, { useState, useEffect } from "react";
import axios from "axios";
import Containar from "../../../layouts/Containar";
import { socialList } from "../../constants";
import { Link } from "react-router-dom";

const UpperFooter = () => {
  const [categories, setCategories] = useState([]);

  const accountList = [
    {
      name: "Shipping rates & policies",
      link: "/shipingrates-policy",
    },
    {
      name: "Refunds & replacements",
      link: "/refund-replace",
    },
    {
      name: "Delivery info",
      link: "/delivery-info",
    },
    {
      name: "About us",
      link: "/about",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://server.al-adal.com/api/v1/category"
        );
        setCategories(response.data.data.doc); // Assuming response.data contains the array of categories
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="py-12 font-inter bg-[#373F50]">
      <Containar>
        <div className="w-full flex justify-between flex-wrap">
          <div className="w-1/2 md:w-1/3">
            <h3 className="text-base md:text-lg text-white font-semibold">
              Shop Categories
            </h3>
            <ul className="mt-6 flex flex-col gap-y-4">
              {categories.slice(0, 6).map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/shop/category/${item?._id}`}
                    className="text-base hover:pl-1.5 cursor-pointer text-gray-400 transition-all ease-linear duration-200 hover:text-danger inline-block"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 md:w-1/3">
            <h3 className="text-base md:text-lg text-white font-semibold">
              Shipping info
            </h3>
            <ul className="mt-6 flex flex-col gap-y-4">
              {accountList.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item?.link}
                    className="text-base text-gray-400 hover:pl-1.5 cursor-pointer transition-all ease-linear duration-200 hover:text-danger inline-block"
                  >
                    {item?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <div className="w-full">
              <h3 className="text-base md:text-lg text-white font-semibold">
                Stay Connected
              </h3>
              <div className="mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6864.396602233587!2d90.34609344259324!3d23.829649743484204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c130328f68d5%3A0x18f1901aea3317d4!2sAl-Adal!5e0!3m2!1sen!2sbd!4v1725093261416!5m2!1sen!2sbd"
                  width="100%"
                  className="h-52"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default UpperFooter;
