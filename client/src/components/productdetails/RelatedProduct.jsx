import React, { useContext, useEffect, useState } from "react";
// Import Swiper React components
import Containar from "../../layouts/Containar";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Autoplay, Thumbs } from "swiper/modules";

import { Link } from "react-router-dom";
import {
  FaBangladeshiTakaSign,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { BsCartCheck } from "react-icons/bs";
import { motion } from "framer-motion";
import ProductItem from "../productitem/ProductItem";
import ApiContext from "../baseapi/BaseApi";

const RelatedProduct = ({ id }) => {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseApi}/category/${id}/options`);
        // console.log(response);
        const data = await response.json(); // Log data to inspect structure
        let fetchedProducts = data?.data?.options.reverse() || [];

        // Remove duplicates based on product ID
        const uniqueProducts = [];
        const seenProductIds = new Set();
        fetchedProducts.forEach((item) => {
          if (!seenProductIds.has(item.product._id)) {
            seenProductIds.add(item.product._id);
            uniqueProducts.push(item);
          }
        });

        // Collect all sizes for each product
        const productsWithSizes = uniqueProducts.map((product) => {
          const sizes = product.variant?.sizes || [];
          return {
            ...product,
            sizes, // Add sizes to the product object if needed
          };
        });

        // setAllCategoryShop(filteredProducts.reverse());
        setProductList(productsWithSizes); // Adjust according to your API response structure
        // console.log("productList", productList);
      } catch (error) {
        // console.error("Error fetching products:", error);
        setError(error.message);
      }
    };

    fetchProducts();
  }, [id, baseApi]);

  return (
    <section className="font-inter pt-10 md:pt-20 pb-20 md:pb-32 border-t border-t-border overflow-hidden">
      <Containar>
        <h4 className="text-3xl font-medium text-texthead">Related Products</h4>
        <div className="mt-5">
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : productList.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 2 }}
              className="mt-12 W-full relative"
            >
              <Swiper
                modules={[Navigation, Autoplay]}
                slidesPerView={1}
                loop={true}
                speed={1000}
                autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
                navigation={{
                  nextEl: ".swiper-button-next3",
                  prevEl: ".swiper-button-prev3",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  370: {
                    slidesPerView: 1,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1280: {
                    slidesPerView: 5,
                  },
                }}
                className="mySwiper w-full group-edit "
              >
                {productList.map((item, index) => (
                  <SwiperSlide key={index}>
                    <ProductItem
                      key={item?._id}
                      product={item}
                      image={item?.product?.photos}
                      id={item?.product?._id}
                      subtitle={item?.brand?.title}
                      title={item?.product?.name}
                      categoryId={item?.category?._id}
                      brandId={item?.brand?._id}
                      categoryName={item?.category?.title}
                      discount={item?.discountValue}
                      discountType={item?.discountType}
                      discountPercent={item?.discountPercent}
                      priceAfterDiscount={item?.salePrice}
                      offerprice={item?.price - item?.discount}
                      freeShipping={item?.freeShipping}
                      regularprice={item?.price}
                      classItem="w-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-button-next3 absolute z-20 -right-5 lg:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380] ">
                <FaChevronRight className="text-xs" />
              </div>
              <div className="swiper-button-prev3 absolute z-20 -left-5 lg:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]">
                <FaChevronLeft className="text-xs" />
              </div>
            </motion.div>
          )}
        </div>
      </Containar>
    </section>
  );
};

export default RelatedProduct;
