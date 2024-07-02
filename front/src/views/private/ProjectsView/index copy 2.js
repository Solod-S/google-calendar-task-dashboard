import React, { useState } from "react";
import reducer from "../../../store/projects";
import { injectReducer } from "store/index";
import { AdaptableCard } from "components/shared";
import ProductTable from "./components/ProductTable";
import ProductTableTools from "./components/ProductTableTools";
import { Modal } from "antd";
import ProjectView from "../ProjectView";
import isEqual from "lodash/isEqual";
import { updateEvent } from "../ProjectView/components/Calendar/store/dataSlice";
import { useDispatch } from "react-redux";

injectReducer("projects", reducer);

const ProjectList = () => {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProjectData, setCurrentProjectData] = useState(null);
  const [modalKey, setModalKey] = useState(0);

  const onEdit = data => {
    setIsModalVisible(true);
    setCurrentProjectData(data);
    setModalKey(prevKey => prevKey + 1); // Ensure modal key is updated
  };

  const showModal = () => {
    setIsModalVisible(true);
    setModalKey(prevKey => prevKey + 1); // Ensure modal key is updated
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setCurrentProjectData(null); // Reset the data
  };

  const handleCancel = data => {
    console.log(`data`, data);
    console.log(`currentProjectData`, currentProjectData);
    console.log(`isEqual`, isEqual(data, currentProjectData));
    dispatch(updateEvent([]));
    setIsModalVisible(false);
    setCurrentProjectData(null); // Reset the data
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">Projects</h3>
        <ProductTableTools showModal={showModal} />
      </div>
      <ProductTable onEdit={onEdit} />
      <Modal
        width="80%"
        key={modalKey} // Key to force re-render
        footer={null}
        title="Project settings"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProjectView
          handleOk={handleOk}
          handleCancel={handleCancel}
          currentProjectData={currentProjectData}
          setCurrentProjectData={setCurrentProjectData}
        />
      </Modal>
    </AdaptableCard>
  );
};

export default ProjectList;
