import React, { useRef, useState } from "react";
import { Button, Drawer } from "components/ui";
import CustomerEditContent from "./CustomerEditContent";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerClose, setSelectedCustomer } from "../store/stateSlice";
import { Modal } from "antd";
import { isEqual } from "lodash";

const DrawerFooter = ({ onSaveClick, onCancel }) => {
  return (
    <div className="text-right w-full">
      <Button size="sm" className="mr-2" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm" variant="solid" onClick={onSaveClick}>
        Save
      </Button>
    </div>
  );
};

const CustomerEditDialog = ({ setGeneralData }) => {
  const dispatch = useDispatch();
  const [isWarningVisible, setisWarningVisible] = useState(false);
  const drawerOpen = useSelector(state => state.crmCustomers.state.drawerOpen);
  const customer = useSelector(
    state => state.crmCustomers.state.selectedCustomer
  );

  const onDrawerClose = () => {
    dispatch(setDrawerClose());
    dispatch(setSelectedCustomer({}));
  };
  // TODO REF USE 1
  const formikRef = useRef();

  const formSubmit = () => {
    formikRef.current?.submitForm();
  };

  const handleScheduleFormCancel = () => {
    const result = formikRef.current?.getScheduleFormData();
    const noChange = isEqual(customer, result);
    if (noChange) {
      onDrawerClose();
      setisWarningVisible(false);
    } else {
      setisWarningVisible(true);
    }
  };

  return (
    <>
      <Modal
        title="Warning"
        okButtonProps={{
          style: { backgroundColor: "#4F46E5" },
        }}
        open={isWarningVisible}
        onOk={() => {
          onDrawerClose();
          setisWarningVisible(false);
        }}
        onCancel={() => setisWarningVisible(false)}
      >
        <p>Are you sure you want to close the window without saving?</p>
      </Modal>
      <Drawer
        zIndex={true}
        isOpen={drawerOpen}
        onClose={handleScheduleFormCancel}
        onRequestClose={handleScheduleFormCancel}
        closable={false}
        bodyClass="p-0"
        showBackdrop={false}
        footer={
          <DrawerFooter
            onCancel={handleScheduleFormCancel}
            onSaveClick={formSubmit}
          />
        }
      >
        <CustomerEditContent ref={formikRef} setGeneralData={setGeneralData} />
      </Drawer>
    </>
  );
};

export default CustomerEditDialog;
