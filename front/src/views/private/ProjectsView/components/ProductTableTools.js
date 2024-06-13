import React, { useState } from "react";
import { Button, Modal } from "antd";
import { HiPlusCircle } from "react-icons/hi";
import ProductTableSearch from "./ProductTableSearch";
import { Link } from "react-router-dom";
import ProjectView from "views/private/ProjectView";

const ProductTableTools = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      <ProductTableSearch />
      <Link
        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
        to="/projects/new"
      >
        <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
          Add Project
        </Button>
      </Link>
      <Button
        block
        variant="solid"
        size="sm"
        icon={<HiPlusCircle />}
        onClick={showModal}
      >
        Add
      </Button>
      <Modal
        footer={null}
        title="Add New Project"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProjectView handleOk={handleOk} handleCancel={handleCancel} />
      </Modal>
    </div>
  );
};

export default ProductTableTools;
