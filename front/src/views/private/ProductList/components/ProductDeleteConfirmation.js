import React from "react";
import { toast, Notification } from "components/ui";
import { ConfirmDialog } from "components/shared";
import { useSelector, useDispatch } from "react-redux";
import { toggleDeleteConfirmation } from "../../../../store/projects/projectStateSlice";
import {
  deleteProject,
  getProducts,
} from "../../../../store/projects/projectDataSlice";

const ProductDeleteConfirmation = () => {
  const dispatch = useDispatch();
  const dialogOpen = useSelector(
    state => state.projects.state.deleteConfirmation
  );
  const selectedProduct = useSelector(
    state => state.projects.state.selectedProduct
  );
  const tableData = useSelector(state => state.projects.data.tableData);

  const onDialogClose = () => {
    dispatch(toggleDeleteConfirmation(false));
  };

  const onDelete = async () => {
    dispatch(toggleDeleteConfirmation(false));
    const success = await deleteProject({ id: selectedProduct });

    if (success) {
      dispatch(getProducts(tableData));
      toast.push(
        <Notification
          title={"Successfuly Deleted"}
          type="success"
          duration={2500}
        >
          Product successfuly deleted
        </Notification>,
        {
          placement: "top-center",
        }
      );
    }
  };

  return (
    <ConfirmDialog
      isOpen={dialogOpen}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      type="danger"
      title="Delete product"
      onCancel={onDialogClose}
      onConfirm={onDelete}
      confirmButtonColor="red-600"
    >
      <p>
        Are you sure you want to delete this product? All record related to this
        product will be deleted as well. This action cannot be undone.
      </p>
    </ConfirmDialog>
  );
};

export default ProductDeleteConfirmation;
