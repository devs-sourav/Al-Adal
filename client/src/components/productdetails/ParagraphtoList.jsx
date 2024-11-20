import React from "react";
import Containar from "../../layouts/Containar";

const ParagraphtoList = ({ paragraph }) => {
  return (
    <section className="pb-16 pt-10 xl:pt-10">
      <Containar>
        <h2 className="text-3xl font-medium text-texthead">Product Details</h2>
        <div
          className="default_behave"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      </Containar>
    </section>
  );
};

export default ParagraphtoList;
