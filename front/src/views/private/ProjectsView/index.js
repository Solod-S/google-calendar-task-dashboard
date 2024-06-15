import React, { useState } from "react";
import reducer from "../../../store/projects";
import { injectReducer } from "store/index";
import { AdaptableCard } from "components/shared";
import ProductTable from "./components/ProductTable";
import ProductTableTools from "./components/ProductTableTools";
import { Modal } from "antd";
import ProjectView from "../ProjectView";

injectReducer("projects", reducer);

const ProjectList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProjectData, setCurrentProjectData] = useState(null);

  const onEdit = data => {
    setIsModalVisible(true);
    setCurrentProjectData(data);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentProjectData(null);
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">Projects</h3>
        <ProductTableTools showModal={showModal} />
      </div>
      <ProductTable onEdit={onEdit} />
      <Modal
        footer={null}
        title="Add New Project"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProjectView
          handleOk={handleOk}
          handleCancel={handleCancel}
          currentProjectData={currentProjectData}
        />
      </Modal>
    </AdaptableCard>
  );
};

export default ProjectList;
