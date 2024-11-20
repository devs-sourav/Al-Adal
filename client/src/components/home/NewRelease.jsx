import React, { useState, useEffect, useRef, useContext } from "react";
import Containar from "../../layouts/Containar";
import { Link } from "react-router-dom";
import ProductItem from "../productitem/ProductItem";
import { useInView, motion, useAnimation } from "framer-motion";
import ApiContext from "../baseapi/BaseApi";
import axios from "axios";

const NewRelease = () => {
  const baseApi = useContext(ApiContext);
  const [currentList, setCurrentList] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [banners, setBanners] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animation = useAnimation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/category`);
        const categories = data.data.doc.reverse().slice(0, 4);
        setCategory(categories);

        if (categories.length > 0) {
          const firstCategoryId = categories[0]._id;
          setSelectedCategory(firstCategoryId);
          const { data: variantData } = await axios.get(
            `${baseApi}/category/${firstCategoryId}/options`
          );
          // setCurrentList(variantData.data?.options?.reverse().slice(0, 8));
          const fetchedProducts = variantData.data?.options; // Adjust according to API response structure

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

          setCurrentList(productsWithSizes.reverse().slice(0, 8));
          // console.log("currentList", currentList);
        }
      } catch (err) {
        setError("Error fetching categories");
        // console.error(err);
      }
    };

    fetchCategories();
  }, [baseApi]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/banner`);
        const filteredBanners = data.data.doc.filter(
          (banner) => banner.bannerType === "New Release"
        );
        setBanners(filteredBanners.pop()); // Get the last banner
      } catch (err) {
        setError("Error fetching banners");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [baseApi]);

  useEffect(() => {
    if (inView) {
      animation.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 1,
          delay: 0.3,
          ease: "easeIn",
        },
      });
    }
  }, [inView, animation]);

  const handleSelect = async (id) => {
    setSelectedCategory(id);
    try {
      const { data } = await axios.get(`${baseApi}/category/${id}/options`);
      setCurrentList(data.data?.options);
    } catch (err) {
      setError("Error fetching category variants");
      // console.error(err);
    }
  };

  return (
    <section ref={ref} className="pt-14 lg:pt-28 overflow-hidden">
      <Containar>
        <div className="flex flex-wrap justify-between items-center">
          <h3 className="text-center text-[24px] lg:text-head text-texthead font-medium">
            New Releases
          </h3>
          <ul className="flex gap-x-5 lg:gap-x-10 mt-2">
            {category.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSelect(item._id)}
                className={`${
                  selectedCategory === item._id
                    ? 'text-base font-medium text-texthead relative before:content-[""] before:absolute before:-bottom-3 before:left-0 before:w-full before:h-[1px] before:bg-texthead cursor-pointer'
                    : 'text-base font-medium text-paracolor relative before:content-[""] before:absolute before:-bottom-3 before:right-0 before:w-0 before:h-[1px] before:bg-texthead cursor-pointer hover:before:left-0 hover:before:w-full before:transition-all before:ease-linear before:duration-200 hover:text-texthead transition-all ease-linear duration-200'
                }`}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-12 mt-10">
          {banners && (
            <div
              animate={animation}
              initial={{ opacity: 0, y: 100 }}
              className="col-span-12 lg:inline-block md::col-span-6 lg:col-span-4 border border-border bg-bestdealbg hidden"
            >
              <Link to="/shop">
                <img
                  className="w-full h-full object-cover"
                  src={banners.photo}
                  alt="New Release"
                />
              </Link>
            </div>
          )}
          <motion.div
            animate={animation}
            initial={{ opacity: 0, x: 100 }}
            className="col-span-12 lg:col-span-8"
          >
            <div className="flex flex-wrap">
              {currentList.map((item) => (
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
                  freeShipping={item?.freeShipping}
                  regularprice={item?.price}
                  classItem="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </Containar>
    </section>
  );
};

export default NewRelease;
