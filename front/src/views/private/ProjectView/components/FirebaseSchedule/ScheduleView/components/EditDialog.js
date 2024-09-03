import React, { useRef, useState } from "react";
import { Button, Drawer } from "components/ui";
import EditContent from "./EditContent";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerClose, setSelectedSchedule } from "../store/stateSlice";
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

const EditDialog = ({ setGeneralData }) => {
  const dispatch = useDispatch();
  const [isWarningVisible, setisWarningVisible] = useState(false);
  const drawerOpen = useSelector(
    state => state.firebaseSchedule.state.drawerOpen
  );
  const schedule = useSelector(
    state => state.firebaseSchedule.state.selectedSchedule
  );

  const onDrawerClose = () => {
    dispatch(setDrawerClose());
    dispatch(setSelectedSchedule({}));
  };
  // TODO REF USE 1
  const formikRef = useRef();

  const formSubmit = () => {
    formikRef.current?.submitForm();
  };

  const handleScheduleFormCancel = () => {
    const result = formikRef.current?.getScheduleFormData();
    const noChange = isEqual(schedule, result);
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
        <EditContent ref={formikRef} setGeneralData={setGeneralData} />
      </Drawer>
    </>
  );
};

export default EditDialog;
