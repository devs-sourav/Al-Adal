import React from "react";
import Containar from "../../layouts/Containar";
import { Link } from "react-router-dom";
import { socialList } from "../constants";

const ContactInfo = () => {
  return (
    <section>
      <Containar>
        <div className="flex justify-center mb-36">
          <div className="w-[970px] lg:h-[400px] px-0 sm:px-20 py-10 sm:py-20 bg-white block relative top-0 sm:-top-28 ">
            <div>
              <h3 className="text-2xl md:text-4xl text-texthead font-medium">
                Contact Information
              </h3>
              <p className="text-base italic text-texthead font-normal mt-12">
                We will answer any questions you may have about our online
                sales, rights or partnership service right here.
              </p>
            </div>
            <div className="mt-14 flex gap-x-36 flex-wrap ">
              <div className="mb-5 lg:mb-0">
                <div>
                  <h4 className="text-xl font-medium text-texthead">
                    Dhaka Office
                  </h4>
                  <p className="mt-4 text-texthead text-sm">
                    House-F/36, Road-S/1a, <br /> eastern Housing, Extension
                    pallabi, <br />
                    mirpur, ,
                    <br /> Dhaka, Bangladesh
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to={"mailto:al.adal0021@gmail.com"}
                    className="text-sm text-texthead mb-1 block hover:text-danger"
                  >
                    al.adal0021@gmail.com
                  </Link>
                  <Link
                    to={"tel:01712-653211"}
                    className="text-sm text-texthead hover:text-danger"
                  >
                    01712-653211
                  </Link>
                </div>
              </div>
              {/* <div className="">
                <div>
                  <h4 className="text-xl font-medium text-texthead">
                    New York Office
                  </h4>
                  <p className="mt-4 text-texthead text-sm">
                    1418 River Drive, Suite 35 Cottonhall, CA 9622
                    <br /> United States
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to={"mailto:al.adal0021@gmail.com"}
                    className="text-sm text-texthead mb-1 block transition-all ease-linear duration-100 hover:text-danger"
                  >
                    al.adal0021@gmail.com
                  </Link>
                  <Link
                    to={"tel:01712-653211"}
                    className="text-sm text-texthead transition-all ease-linear duration-100 hover:text-danger"
                  >
                    01712-653211
                  </Link>
                </div>
              </div> */}
            </div>
            <div className="mt-16">
              <h3 className="text-xl text-texthead font-medium ">
                Social Media
              </h3>
              <ul className="pt-5 flex gap-x-7">
                {socialList.map((item, index) => {
                  let Icon = item.logo;
                  return (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="transition-all ease-linear duration-100 hover:text-danger block"
                      >
                        <Icon />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Containar>
    </section>
  );
};

export default ContactInfo;
