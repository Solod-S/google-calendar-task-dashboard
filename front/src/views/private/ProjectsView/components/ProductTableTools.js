import React, { useState } from "react";
import { Button } from "antd";
import { HiPlusCircle } from "react-icons/hi";
import ProductTableSearch from "./ProductTableSearch";
import { Link } from "react-router-dom";

const ProductTableTools = ({ showModal }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      <ProductTableSearch />
      <Link className="block lg:inline-block md:mx-2 md:mb-0 mb-4">
        <Button
          block
          variant="solid"
          size="sm"
          onClick={showModal}
          icon={<HiPlusCircle />}
        >
          Add Project
        </Button>
      </Link>
    </div>
  );
};

export default ProductTableTools;
