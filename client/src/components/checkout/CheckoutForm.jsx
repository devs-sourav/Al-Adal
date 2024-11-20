import React, { useEffect, useState } from "react";
import { FaBangladeshiTakaSign, FaMinus } from "react-icons/fa6";
import Containar from "../../layouts/Containar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { TiArrowBackOutline } from "react-icons/ti";
import { deleteFromCart, resetCart } from "../../redux/slices/cartSlices";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import axios from "axios";
import { FiDelete } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { city } from "../constants";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState(true);
  const [loadingZone, setLoadingZone] = useState(true);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [zonelist, setZoneList] = useState([]);
  const [arealist, setAreaList] = useState([]);
  const [cityKey, setCityKey] = useState(0);
  const [ZoneKey, setZoneKey] = useState(0);
  // const [zone, setZone] = useState();

  // const [cityList, setCityList] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    district: {},
    streetAddress: "",
    area: {},
    zone: {},
    shipping: "",
    payment: "cod",
    couponCode: "", // Added couponCode to formData
  });

  useEffect(() => {
    setLoadingCity(true);
    if (cityKey !== 0) {
      getCZone(cityKey);
      // Fetch zones only if a city is selected
    }
    // getCZone(cityKey);
  }, [cityKey]);

  useEffect(() => {
    setLoadingZone(true);
    getCArea(ZoneKey);
  }, [ZoneKey]);

  const getCZone = async (id) => {
    try {
      // Make the API request to get the zones
      const response = await axios.post(
        `https://server.al-adal.com/api/v1/pathaoLocation/city/${id}/zones`
      );

      // You can handle the successful response here
      setZoneList(response.data.data.data);
      if (response.data.data.data.length > 0) {
        setLoadingCity(false);
      }

      // return response.data; // Return the zones if needed
    } catch (error) {
      // Handle any errors that occur during the request
      // console.error("Error fetching zones:", error);
      return null; // Return null or handle the error based on your logic
    }
  };
  // console.log("Zones received:", zonelist);

  const getCArea = async (id) => {
    // setLoaderA(true);
    if (id === 0) {
      return;
    }
    try {
      const res = await axios.post(
        `https://server.al-adal.com/api/v1/pathaoLocation/zone/${id}/area-list`
      );
      setAreaList(res?.data?.data.data);
      if (res?.data?.data.data.length > 0) {
        setLoadingZone(false);
      }
      // console.log(arealist, "arealist");
      // setLoaderA(false);
    } catch (error) {
      // setLoaderA(false);
      // console.error(error);
    }
  };

  // console.log("formData", formData);

  const handleCouponCode = async () => {
    if (formData.couponCode.trim() === "") {
      setCouponError("Coupon code cannot be empty");
      setCouponDiscount(0);
      formData.couponCode = "";
      return;
    }

    try {
      const response = await axios.get(
        `https://server.al-adal.com/api/v1/coupon/${formData.couponCode}`
      );
      // console.log(response);
      if (response.data.status == "success") {
        setCouponDiscount(response.data.data.coupon.discountPercent);
        setCouponError("");
      } else {
        setCouponError("Invalid coupon code");
        setCouponDiscount(0);
      }
    } catch (error) {
      // console.error("Error fetching coupon", error);
      setCouponError("Coupon code not found");
      setCouponDiscount(0);
    }
  };

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const hasFreeShipping = cartItems.some((item) => item.freeShipping);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        (couponDiscount > 0
          ? item?.selectedOption?.price
          : item?.selectedOption.discountValue > 0
          ? Math.ceil(item?.selectedOption?.salePrice)
          : item?.selectedOption?.price) *
          item.quantity,
      0
    );
  };

  // Calculate shipping cost
  const getShippingCost = () => {
    if (hasFreeShipping) return 0;
    switch (formData.shipping) {
      case "insideDhaka":
        return 70;
      case "outsideDhaka":
        return 140;
      default:
        return 0;
    }
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const subtotal = calculateSubtotal();
    const discount = (couponDiscount / 100) * subtotal; // Calculate discount
    const shippingCost = getShippingCost();
    const total = subtotal - discount + shippingCost; // Apply discount to subtotal and add shipping cost
    return Math.ceil(total);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Parse JSON values for area, zone, and district
    if (name === "area" || name === "district" || name === "zone") {
      updatedValue = JSON.parse(value);
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    // Update cityKey and zoneKey if district or zone changes
    if (name === "district") {
      setCityKey(updatedValue?.city_id || 0);
    }
    if (name === "zone") {
      setZoneKey(updatedValue?.zone_id || 0);
    }

    // Clear specific error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error message for the current field
    }));
  };

  // console.log(cityKey);

  const validate = () => {
    const newErrors = {};

    // Ensure all required fields are filled
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{11,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be at least 11 digits";
    }
    if (!formData.streetAddress)
      newErrors.streetAddress = "Street Address is required";
    if (!formData.area || !formData.area.area_id)
      newErrors.area = "Area is required";
    if (!formData.district || !formData.district.city_id)
      newErrors.district = "City is required";
    if (!formData.zone || !formData.zone.zone_id)
      newErrors.zone = "Zone is required";
    if (!formData.shipping && !hasFreeShipping)
      newErrors.shipping = "Shipping method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // Proceed only if validation is successful
      setIsLoading(true);
      try {
        // Prepare order data
        const orderData = {
          name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          city: {
            cityID: formData.district?.city_id,
            cityName: formData.district?.city_name,
          },
          zone: {
            zoneID: formData.zone?.zone_id,
            zoneName: formData.zone?.zone_name,
          },
          area: {
            areaID: formData.area?.area_id,
            areaName: formData.area?.area_name,
          }, // Ensure area ID is passed
          streetAddress: formData.streetAddress,
          shippingCost: getShippingCost(),
          products: cartItems.map((item) => ({
            option: item.colorOptionId,
            quantity: item.quantity,
            userSelectedColor: item.userChoiceColor || "", // Include userSelectedColor if needed
          })),
          ...(formData.couponCode.trim() && { coupon: formData.couponCode }),
        };

        // console.log("orderData", orderData);

        // Determine the API endpoint
        const apiEndpoint = formData.couponCode.trim()
          ? "https://server.al-adal.com/api/v1/order/withCoupon"
          : "https://server.al-adal.com/api/v1/order";

        // Post data to API
        const response = await axios.post(apiEndpoint, orderData);

        // Handle successful response
        dispatch(resetCart());
        navigate("/thankyou");
      } catch (error) {
        setIsLoading(false); // Stop loading
        // console.error("Error submitting order", error);
        setCouponError(
          error.response?.data?.message ||
            "An error occurred while placing the order"
        );
      }
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      shipping: "",
      payment: "cod",
      couponCode: "", // Reset coupon code
      district: {},
      streetAddress: "",
      area: {},
      zone: {},
    });
    setErrors({});
  };

  return (
    <section className="pb-20 font-inter bg-[#FEF6F6]">
      {cartItems.length > 0 ? (
        <Containar>
          <div>
            <div className="grid grid-cols-12  md:gap-x-8">
              <div className="col-span-12 order-2 lg:order-1 lg:col-span-8  ">
                <div className="bg-white pt-8 pb-12 px-6 shadow-md">
                  <h2 className="text-texthead text-lg font-medium">
                    Shipping Address
                  </h2>
                  <div className="mt-7">
                    <form onSubmit={handleSubmit}>
                      <div className="w-full flex items-start flex-wrap justify-between">
                        <div className="w-full">
                          <h4 className="text-[15px] font-medium">
                            Full Name *
                          </h4>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.fullName
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Enter your full name"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full flex items-start flex-wrap justify-between mt-5">
                        <div className="w-full lg:w-[49%]">
                          <h4 className="text-[15px] font-medium">
                            Phone Number *
                          </h4>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.phoneNumber
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Enter your phone number"
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>
                        <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          <h4 className="text-[15px] font-medium">
                            Email{" "}
                            <span className="text-xs font-normal">
                              ( for invoice, please provide your email )
                            </span>
                          </h4>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 px-3 border border-border mt-2"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div className="w-full flex items-start flex-wrap justify-between mt-5">
                        <div className="w-full lg:w-[49%] lg:mt-0 mt-5">
                          <h4 className="text-[15px] font-medium">City *</h4>
                          <select
                            // onChange={handleInputChange}
                            onChange={handleChange}
                            className={`w-full py-3  px-3 mt-2 h-12 leading-tight text-texthead transition border rounded-md appearance-none lg:pl-3 focus:shadow focus:placeholder-gray-600 focus:outline-none focus:ring-gray-600 focus:shadow-outline ${
                              errors.district
                                ? "border-red-500"
                                : "border-border"
                            }
                            }`}
                            name="district"
                          >
                            {city?.map((cityInfo) => (
                              <option
                                key={cityInfo?.city_id}
                                value={JSON.stringify(cityInfo)}
                              >
                                {cityInfo?.city_name}{" "}
                              </option>
                            ))}
                          </select>
                          {errors.district && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.district}
                            </p>
                          )}
                        </div>
                        <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          <h4 className="text-[15px] font-medium">Zone *</h4>
                          <select
                            // onChange={handleInputChange}
                            onChange={handleChange}
                            className={`w-full py-3  px-3 mt-2 h-12 leading-tight text-texthead transition border rounded-md appearance-none lg:pl-3 focus:shadow focus:placeholder-gray-600 focus:outline-none focus:ring-gray-600 focus:shadow-outline ${
                              errors.district
                                ? "border-red-500"
                                : "border-border"
                            }
                            }`}
                            name="zone"
                          >
                            {loadingCity ? (
                              <>
                                <option value="">Select Zone ↓</option>
                                <option value="">Loading...</option>
                              </>
                            ) : (
                              <>
                                <option value="">Select Zone ↓</option>

                                {zonelist?.map((zoneInfo) => (
                                  <option
                                    key={zoneInfo?.zone_id}
                                    value={JSON.stringify(zoneInfo)}
                                  >
                                    {zoneInfo?.zone_name}{" "}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                          {errors.zone && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.zone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full flex items-start flex-wrap justify-between mt-5">
                        <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          <h4 className="text-[15px] font-medium">Area *</h4>
                          <select
                            // onChange={handleInputChange}
                            onChange={handleChange}
                            className={`w-full py-3  px-3 mt-2 h-12 leading-tight text-texthead transition border rounded-md appearance-none lg:pl-3 focus:shadow focus:placeholder-gray-600 focus:outline-none focus:ring-gray-600 focus:shadow-outline ${
                              errors.district
                                ? "border-red-500"
                                : "border-border"
                            }
                            }`}
                            name="area"
                          >
                            {loadingZone ? (
                              <>
                                <option value="">Select Area ↓</option>
                                <option value="">Loading...</option>
                              </>
                            ) : (
                              <>
                                <option value="">Select Area ↓</option>
                                {arealist?.map((areaInfo) => (
                                  <option
                                    key={areaInfo?.area_id}
                                    value={JSON.stringify(areaInfo)}
                                  >
                                    {areaInfo?.area_name}{" "}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                          {errors.area && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.area}
                            </p>
                          )}
                        </div>
                        <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          <h4 className="text-[15px] font-medium">
                            Street Address *
                          </h4>
                          <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.streetAddress
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="House number and street name"
                          />
                          {errors.streetAddress && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.streetAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="w-full flex items-start flex-wrap justify-between mt-10">
                        {hasFreeShipping ? (
                          <div className="self-center px-5 rounded-md py-2 shadow-lg text-xs bg-green-600 text-white flex items-center gap-x-0.5">
                            <h3 className="text-xl">Free Shipping</h3>
                          </div>
                        ) : (
                          <div className="w-full lg:w-[49%]">
                            <h4 className="text-[15px] font-medium mb-5">
                              Shipping *
                            </h4>
                            <div className="flex flex-wrap gap-x-10  items-start">
                              <label className="flex items-start text-sm font-medium gap-x-1 cursor-pointer">
                                <input
                                  className="mt-1"
                                  name="shipping"
                                  id="shippingInsideDhaka"
                                  type="radio"
                                  value="insideDhaka"
                                  checked={formData.shipping === "insideDhaka"}
                                  onChange={handleChange}
                                  required={hasFreeShipping ? false : true}
                                />
                                <div>
                                  <h3>Inside of Dhaka</h3>
                                  <h4 className="mt-2 sm:mt-5 flex items-center gap-x-0.5">
                                    <FaBangladeshiTakaSign /> 70tk
                                  </h4>
                                </div>
                              </label>
                              <label className="flex items-start text-sm font-medium gap-x-1 cursor-pointer ">
                                <input
                                  className="mt-1"
                                  name="shipping"
                                  id="shippingOutsideDhaka"
                                  type="radio"
                                  value="outsideDhaka"
                                  checked={formData.shipping === "outsideDhaka"}
                                  onChange={handleChange}
                                  required={hasFreeShipping ? false : true}
                                />
                                <div>
                                  <h3>Outside of Dhaka</h3>
                                  <h4 className="mt-2 sm:mt-5 flex items-center gap-x-0.5">
                                    <FaBangladeshiTakaSign /> 140tk
                                  </h4>
                                </div>
                              </label>
                            </div>
                            {errors.shipping && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors.shipping}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="w-full mt-7 sm:mt-0 lg:w-[49%]">
                          <h4 className="text-[15px] font-medium mb-2 sm:mb-5">
                            Coupons Codes
                          </h4>
                          <input
                            type="text"
                            name="couponCode"
                            value={formData.couponCode}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.couponCode
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Enter your coupon code"
                          />
                          <button
                            type="button"
                            onClick={handleCouponCode}
                            className="mt-2 bg-texthead hover:bg-texthead transition-all ease-linear duration-200 text-white px-4 py-2 rounded"
                          >
                            Apply Coupon
                          </button>
                          {couponError && (
                            <p className="text-red-500 text-sm mt-2">
                              {couponError}
                            </p>
                          )}

                          {couponDiscount > 0 && !couponError && (
                            <p className="text-green-600 text-sm mt-2">
                              Coupon applied! Discount: {couponDiscount}%
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-16 flex gap-4">
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={isLoading}
                          className="px-10 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200"
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-5 flex items-center text-white justify-center font-medium hover:bg-green-600 transition-all ease-linear duration-200 bg-texthead cursor-pointer"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                                ></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Place Order"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-span-12 order-1 lg:order-2 mt-5 lg:mt-0 lg:col-span-4">
                <div className="pt-3 bg-white shadow-md border border-texthead">
                  <div className="py-5 border-b border-b-border">
                    <h2 className="px-6 capitalize text-texthead text-lg font-medium">
                      Your Order
                    </h2>
                    <ul className="mt-5">
                      {cartItems.map((item) => (
                        <li
                          key={item?._id}
                          className="px-6 flex items-center justify-between text-sm py-3"
                        >
                          <span className="w-[70%]">
                            <Link
                              to={`/productdetail/${item?._id}`}
                              className="text-texthead cursor-pointer hover:text-danger transition-all ease-linear duration-200"
                            >
                              {item?.name}
                            </Link>{" "}
                            × {item?.quantity}
                            {item?.userChoiceColor &&
                              item?.userChoiceColor.length > 0 && (
                                <h4 className="text-xs mt-1">
                                  Color:{" "}
                                  <span className="capitalize w-4 h-4">
                                    {item?.userChoiceColor}
                                  </span>
                                </h4>
                              )}
                          </span>{" "}
                          <span className="flex items-center gap-x-1 ">
                            {couponDiscount > 0 ? (
                              <span className="flex items-center text-sm font-medium text-texthead gap-x-0.5">
                                {" "}
                                <FaBangladeshiTakaSign />{" "}
                                {item?.selectedOption?.price}
                              </span>
                            ) : (
                              <>
                                <span className="flex items-center text-sm font-medium text-texthead gap-x-0.5">
                                  {" "}
                                  <FaBangladeshiTakaSign />{" "}
                                  {(item?.selectedOption?.discountValue > 0
                                    ? Math.ceil(item?.selectedOption?.salePrice)
                                    : item?.selectedOption?.price) *
                                    item?.quantity}
                                </span>
                                {item?.selectedOption?.discountValue > 0 && (
                                  <del className="line-through text-normal text-danger">
                                    {" "}
                                    {item?.selectedOption?.discountValue > 0 &&
                                      item?.selectedOption?.price *
                                        item?.quantity}
                                  </del>
                                )}
                              </>
                            )}

                            <span
                              onClick={() =>
                                dispatch(
                                  deleteFromCart({
                                    id: item._id,
                                    colorOptionId: item?.selectedOption?._id,
                                    selectedSize: item?.selectedSize, // Include selected size if applicable
                                  })
                                )
                              }
                              className="text-danger cursor-pointer text-lg"
                            >
                              <MdOutlineDeleteForever />
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="py-10 border-b border-b-border">
                      <ul className=" px-6 flex items-center justify-between text-base">
                        <li>Coupon Discount</li>
                        <li className="flex items-center gap-x-0.5">
                          <FaMinus className="mr-1" /> {couponDiscount} %
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="py-10 border-b border-b-border">
                    <ul className=" px-6 flex items-center justify-between text-base">
                      <li>Subtotal</li>
                      <li className="flex items-center gap-x-0.5">
                        <FaBangladeshiTakaSign />{" "}
                        {couponDiscount > 0
                          ? Math.ceil(
                              calculateSubtotal() -
                                calculateSubtotal() * (couponDiscount / 100)
                            )
                          : calculateSubtotal()}
                      </li>
                    </ul>
                  </div>

                  <div className="py-10 border-b border-b-border">
                    <h2 className="px-6 capitalize text-texthead text-lg font-medium">
                      Delivery Charge
                    </h2>
                    <div className="mt-7 px-6 text-sm flex justify-between items-center">
                      <div className="flex items-start text-base font-normal gap-x-1">
                        <input
                          className="mt-1"
                          name="payment"
                          id="paymentCOD"
                          type="radio"
                          value="cod"
                          checked={formData.payment === "cod"}
                          onChange={handleChange}
                          required
                        />
                        <div>
                          <h3>Cash on delivery</h3>
                        </div>
                      </div>
                      <div className="flex items-start text-base font-normal gap-x-1">
                        <h3 className="flex items-center gap-x-1 text-sm">
                          <FaBangladeshiTakaSign /> {getShippingCost()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="py-10 border-b border-b-border flex justify-between">
                    <h2 className="px-6 capitalize text-texthead text-lg font-medium">
                      Total Cost
                    </h2>
                    <h2 className="px-6 capitalize text-green-600 text-lg font-medium flex items-center gap-x-1">
                      <FaBangladeshiTakaSign /> {calculateTotalCost()}
                    </h2>
                  </div>

                  <div className="py-10 border-b border-b-border">
                    <p className="px-6 text-sm font-normal">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our{" "}
                      <Link to={"/"} className="text-danger">
                        privacy policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => navigate("/cart")}
                    className="py-5 w-full flex items-center justify-center bg-texthead text-white font-medium hover:bg-black"
                  >
                    <span className="flex items-center gap-x-1">
                      <TiArrowBackOutline /> View Cart
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Containar>
      ) : (
        <div className="">
          <div className="flex justify-center items-center">
            <HiOutlineShoppingBag className="text-[240px]" />
          </div>
          <h2 className="text-center text-2xl font-medium mt-5">
            Your Cart is currently empty.
          </h2>
          <div className="flex justify-center items-center mt-6 pb-10">
            <Link
              className="text-lg bg-texthead hover:bg-black transition-all ease-linear duration-200 font-medium px-16 py-4 text-white"
              to={"/shop"}
            >
              Return to shop
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default CheckoutForm;
