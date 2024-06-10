import React from "react";
import reducer from "../../../store/projects";
import { injectReducer } from "store/index";
import { AdaptableCard } from "components/shared";
import ProductTable from "./components/ProductTable";
import ProductTableTools from "./components/ProductTableTools";

injectReducer("projects", reducer);

const ProjectList = () => {
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">Projects</h3>
        <ProductTableTools />
      </div>
      <ProductTable />
    </AdaptableCard>
  );
};

export default ProjectList;
