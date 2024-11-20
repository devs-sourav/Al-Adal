import React from "react";
import { Link } from "react-router-dom";
import Containar from "../../layouts/Containar";
import { socialList } from "../constants";

const AboutInfo = () => {
  return (
    <section>
      <Containar>
        <div className="flex justify-center mb-36">
          <div className="w-[970px] lg:h-[600px] px-0 sm:px-20 py-20 bg-white sm:relative -top-28 ">
            <div>
              <h3 className=" text-2xl md:text-4xl text-texthead font-medium">
                Welcome to Al-Adal
              </h3>
              <p className="text-base italic text-texthead font-normal mt-12">
                “Welcome to Al-Adal, your destination for traditional and
                modest fashion. We specialize in offering a curated selection of
                high-quality Panjabi and Burkha, crafted to reflect both
                cultural heritage and contemporary style. Our products are
                designed to make you feel confident and comfortable, whether
                you're at a family gathering or a formal event.”
              </p>
            </div>
            <div>
              <h4 className="text-xl font-medium text-texthead mt-10">
                What we really do?
              </h4>
              <p className="text-sm font-normal text-texthead mt-2">
                At Al-Adal, we are passionate about providing our customers with
                authentic and stylish Panjabi and Burkha collections. Our mission
                is to blend tradition with modernity, offering a diverse range of
                products that cater to all occasions. We are committed to
                delivering quality and craftsmanship in every piece we offer,
                ensuring that you always look and feel your best.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap sm:gap-x-20">
              <div className="w-[45%]">
                <h4 className="text-xl text-texthead font-medium">
                  Our Vision
                </h4>
                <p className="text-sm mt-2 text-texthead font-normal">
                  Our vision is to be a leading provider of traditional and
                  modest fashion, creating a platform where culture meets
                  contemporary trends. We aim to make Al-Adal a household name
                  for anyone seeking quality Panjabi and Burkha, with a focus on
                  sustainability and ethical production practices.
                </p>
              </div>
              <div className="mt-5 sm:mt-0 w-[45%]">
                <h4 className="text-xl text-texthead font-medium">
                  Our Mission
                </h4>
                <p className="text-sm mt-2 text-texthead font-normal">
                  Our mission is to provide our customers with an exceptional
                  shopping experience, offering a wide selection of Panjabi and
                  Burkha that cater to both traditional and modern tastes. We are
                  dedicated to promoting modest fashion and ensuring that every
                  piece we sell is of the highest quality.
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-xl text-texthead font-medium mt-16">
                Social Media
              </h4>
              <ul className="mt-5 flex gap-x-7">
                {socialList.map((item, index) => {
                  let Icon = item.logo;
                  return (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="transition-all ease-linear duration-100 hover:text-danger"
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

export default AboutInfo;
