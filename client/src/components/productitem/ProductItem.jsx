import React, { useState, useRef, useEffect } from "react";
import { BsCartCheck } from "react-icons/bs";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlices";
import { RiPercentLine } from "react-icons/ri";
import axios from "axios";

const ProductItem = ({
  image = [],
  product,
  discount,
  subtitle,
  title,
  categoryName,
  offerprice,
  regularprice,
  classItem,
  categoryId,
  brandId,
  discountType,
  discountPercent,
  priceAfterDiscount,
  id,
  freeShipping,
}) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalCart, setShowModalCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null); // State for selected size
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setShowModalCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleFetchOptionData = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://server.al-adal.com/api/v1/product/${item?.product?._id}/options`
      );
      setOptions(response.data.data?.options);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch options. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleFetchOptionDataCart = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://server.al-adal.com/api/v1/product/${item?.product?._id}/options`
      );
      setOptions(response.data.data?.options);
      setShowModalCart(true);
    } catch (err) {
      setError("Failed to fetch options. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // console.log("product", product);
  const handleAddToCart = () => {
    const selectedOption = options.find(
      (option) => option.size === selectedSize
    );
    if (!selectedOption) return;

    const item = {
      ...product?.product,
      id: product?.product._id,
      quantity: 1,
      photos: product?.product?.photos,
      name: product?.product?.name,
      colorOptionId: selectedOption?._id,
      // _id:product?._id,
      selectedOption: {
        _id: selectedOption?._id,
        sku: selectedOption?.sku,
        size: selectedOption?.size,
        price: selectedOption?.price,
        salePrice: selectedOption?.salePrice,
        stock: selectedOption?.stock,
        discountType: selectedOption?.discountType,
        discountValue: selectedOption?.discountValue,
        visitCount: selectedOption?.visitCount,
        saleNumber: selectedOption?.saleNumber,
        freeShipping: selectedOption?.freeShipping,
      },
      selectedColor: selectedOption?.variant,
    };

    dispatch(addToCart(item));
    setShowModal(false); // Close the modal after adding to cart
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseModalCart = () => {
    setShowModalCart(false);
  };
  // mb-0 lg:mb-7
  return (
    <div
      className={`${
        classItem ? classItem : ""
      } pb-5 border-[1px] relative hover:border-texthead group border-border  overflow-hidden`}
    >
      {discount > 0 && discountType === "amount" ? (
        <div className="absolute right-2 top-3 px-3 rounded-md py-0.5 shadow-lg text-xs bg-danger text-white flex items-center gap-x-0.5">
          <FaBangladeshiTakaSign />
          {discount}
        </div>
      ) : (
        discount > 0 &&
        discountType === "percent" && (
          <div className="absolute right-2 top-3 px-3 rounded-md py-0.5 shadow-lg text-xs bg-danger text-white flex items-center gap-x-0.5">
            {discount}
            <RiPercentLine />
          </div>
        )
      )}
      {freeShipping && (
        <div className="absolute left-2 top-3 px-2 rounded-md py-0.5 shadow-lg text-xs bg-green-600 text-white flex items-center gap-x-0.5">
          <h3>Free Shipping</h3>
        </div>
      )}

      <div className="w-full ">
        <div className="w-full mx-auto">
          <Link to={`/productdetail/${id}`}>
            <img
              className="w-full object-contain"
              src={[image[0]]}
              alt="product"
            />
          </Link>
        </div>
        <div className="flex justify-between px-4 sm:px-8 items-center pt-2 sm:pt-[90px] relative bg-white">
          <button
            onClick={() => handleFetchOptionData(product)}
            className="relative px-3 py-1 rounded-md bg-danger text-white block after:absolute after:-bottom-1 after:right-0 after:content-[''] after:w-0 after:h-[1px] after:bg-danger hover:after:left-0 hover:after:w-full after:transition-all after:ease-linear after:duration-200 cursor-pointer"
          >
            Buy Now
          </button>
          <h4
            onClick={() => handleFetchOptionDataCart(product)}
            className="w-8 h-8 flex justify-center items-center cursor-pointer hover:text-white transition-all ease-linear duration-200 text-texthead hover:bg-danger rounded-full"
          >
            <BsCartCheck className="text-base" />
          </h4>
          <div className="sm:absolute hidden sm:block left-0 px-4 sm:px-8 top-0 w-full h-[140px] pt-2 pb-1 group-hover:-top-[52px] transition-all ease-linear duration-200 bg-white">
            <ul>
              <li>
                <Link
                  to={`/shop/brand/${brandId}`}
                  className="uppercase inline-block text-xs text-danger mt-2"
                >
                  {subtitle}
                </Link>
              </li>
              <li>
                <Link
                  to={`/productdetail/${id}`}
                  className="text-sm leading-5 inline-block font-medium text-texthead mt-1 text-ellipsis overflow-hidden break-words"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}
                >
                  {title}
                </Link>
              </li>
              {/* <li>
                <p className="text-xs block font-medium mt-1 hover:text-danger transition-all ease-linear duration-200 text-textgray">
                  Size: {product?.size}
                </p>
              </li> */}
            </ul>

            <p className="text-base mt-1 text-texthead flex items-baseline gap-x-2">
              <span className="flex items-center gap-x-0.5">
                <FaBangladeshiTakaSign className="text-sm" />
                {priceAfterDiscount
                  ? Math.ceil(priceAfterDiscount)
                  : regularprice}
              </span>
              {priceAfterDiscount > 0 && (
                <span className="text-xs flex items-center gap-x-0.5 line-through text-gray-600">
                  <FaBangladeshiTakaSign className="text-xs" />
                  {regularprice}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="sm:hidden left-0 px-4 sm:px-8 top-0 w-full h-[140px] z-20 pt-2 pb-1 group-hover:-top-[52px] transition-all ease-linear duration-200 bg-white">
          <Link
            to={`/shop/brand/${brandId}`}
            className="uppercase block text-xs text-danger mt-2"
          >
            {subtitle}
          </Link>
          <Link
            to={`/productdetail/${id}`}
            className="text-sm leading-5 block font-medium text-texthead mt-2 text-ellipsis overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {title}
          </Link>

          <Link
            to={`/shop/category/${categoryId}`}
            className="text-xs block font-medium mt-1 hover:text-danger transition-all ease-linear duration-200 text-textgray"
          >
            {categoryName}
          </Link>
          <p className="text-base mt-1 text-texthead flex items-baseline gap-x-2">
            <span className="flex items-center gap-x-0.5">
              <FaBangladeshiTakaSign className="text-sm" />
              {priceAfterDiscount ? priceAfterDiscount : regularprice}
            </span>
            {priceAfterDiscount && (
              <span className="text-xs flex items-center gap-x-0.5 line-through text-gray-600">
                <FaBangladeshiTakaSign className="text-xs" />
                {regularprice}
              </span>
            )}
          </p>
        </div>
      </div>

      {showModal && (
        <div className="absolute inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white absolute bottom-0 p-4 w-96 max-w-full rounded shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Select Size</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul className="flex gap-x-1 items-center">
                {options.map((option) => (
                  <li
                    key={option._id}
                    className={`py-1 px-2 border ${
                      selectedSize === option.size
                        ? "border-danger text-danger"
                        : ""
                    } cursor-pointer`}
                    onClick={() => handleSizeClick(option.size)}
                  >
                    {option.size}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex gap-x-2">
              <button
                className="px-4 py-2 text-sm bg-texthead text-white rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className={`px-2 py-1 bg-danger text-white rounded ${
                  !selectedSize ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (selectedSize) {
                    handleAddToCart(); // Call your add to cart function
                    navigate("/checkout"); // Navigate to checkout page
                  }
                }}
                disabled={!selectedSize}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showModalCart && (
        <div className="absolute inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white absolute bottom-0 p-4 w-96 max-w-full rounded shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Select Size</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul className="flex gap-x-1 items-center">
                {options.map((option) => (
                  <li
                    key={option._id}
                    className={`py-1 px-2 border ${
                      selectedSize === option.size
                        ? "border-danger text-danger"
                        : ""
                    } cursor-pointer`}
                    onClick={() => handleSizeClick(option.size)}
                  >
                    {option.size}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex gap-x-2">
              <button
                className="px-4 py-2 text-sm bg-texthead text-white rounded"
                onClick={handleCloseModalCart}
              >
                Cancel
              </button>
              <button
                className={`px-2 py-1 bg-danger text-white rounded ${
                  !selectedSize ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  setShowModalCart(false);
                  handleAddToCart(); // Call your add to cart function
                }}
                disabled={!selectedSize}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
