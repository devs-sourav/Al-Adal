import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Containar from "../../layouts/Containar";
import { Link, useNavigate } from "react-router-dom";
import TitleHead from "../titlehead/TitleHead";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa"; // Import a default fallback icon
import { IoImagesOutline } from "react-icons/io5"; // Import icons
import { MdDinnerDining } from "react-icons/md";
import { LiaDoveSolid } from "react-icons/lia";
import { BiHealth, BiLogoGraphql } from "react-icons/bi";
import ApiContext from "../baseapi/BaseApi";

const Feature = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();
  const baseApi = useContext(ApiContext);
  // console.log(baseApi)

  const categoryListPart = [
    {
      name: "Arts & Photography",
      icon: IoImagesOutline,
      bgColor: "#F9F1FF",
      iconColor: "#A201FD",
      link: "/",
    },
    {
      name: "Food & Drink",
      icon: MdDinnerDining,
      bgColor: "#FAF4EB",
      iconColor: "#F79400",
      link: "/",
    },
    {
      name: "Romance",
      icon: LiaDoveSolid,
      bgColor: "#F4E5E5",
      iconColor: "#F01101",
      link: "/",
    },
    {
      name: "Health",
      icon: BiHealth,
      bgColor: "#E6F2F4",
      iconColor: "#04CDEF",
      link: "/",
    },
    {
      name: "Biography",
      icon: BiLogoGraphql,
      bgColor: "#FEF6F6",
      iconColor: "#FF8E8E",
      link: "/",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${baseApi}/category`
        );
        const apiCategories = response.data.data.doc;

        // Create a new array combining categories and categoryListPart
        const combinedCategories = apiCategories.map((apiCategory, index) => {
          // Check if index is within bounds of categoryListPart
          if (index < categoryListPart.length) {
            return { ...apiCategory, ...categoryListPart[index] };
          }
          return apiCategory;
        });

        // If there are remaining items in categoryListPart, append them to the end

        setCategories(combinedCategories.slice(0, 5));
        // console.log(combinedCategories)
      } catch (error) {
        setError("Error fetching categories");
        // console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // console.log(categories)

  // if (loading) return <p>Loading...</p>; // Simple loading message
  if (error) return <p>{error}</p>; // Display error message if any

  return (
    <section className="pt-14 lg:pt-28 font-inter">
      <Containar>
        <TitleHead titile="Feature Categories" subtitle="All Categories" />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className={`flex gap-x-5  ${
            categories.length == 5 ? "lg:justify-between" : "lg:gap-x-5"
          } flex-wrap mt-10 gap-y-5`}
        >
          {categories.map((item, index) => {
            const Icon = item.icon || FaExclamationTriangle; // Fallback icon
            return (
              <Link
                to={`/shop/category/${item?._id}`}
                key={index}
                className="w-[100%] sm:w-[48%] md:w-[30%] lg:w-[18.8%] px-10 py-8"
                style={{ backgroundColor: item.bgColor }}
              >
                {/* <div className="flex items-center justify-center sm:inline-block">
                  <Icon
                    style={{ color: item.iconColor }}
                    className="text-5xl text-center"
                  />
                </div> */}
                <h2 className="mt-5 text-center sm:text-start lg:text-base xl:text-lg font-medium">
                  <span onClick={() => navigate(`/shop/category/${item?._id}`)}>
                    {item?.title}
                  </span>
                </h2>
                <h4 className="mt-2 text-center sm:text-start text-base">
                  <span onClick={() => navigate(`/shop/category/${item?._id}`)}>
                    {" "}
                    Shop Now
                  </span>
                </h4>
              </Link>
            );
          })}
        </motion.div>
      </Containar>
    </section>
  );
};

export default Feature;
